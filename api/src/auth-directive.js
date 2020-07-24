const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const { AccessControl } = require("accesscontrol");

const patchResolver = (field, resolverFactory) => {
  const { resolve = defaultFieldResolver } = field;
  field.resolve = async function (...outerArgs) {
    const resolver = resolverFactory((...innerArgs) =>
      resolve.apply(this, innerArgs)
    );
    return resolver(...outerArgs);
  };
};

class AuthDirective extends SchemaDirectiveVisitor {
  constructor(...args) {
    super(...args);
    this._grants = [];
    this._policy = null;
  }

  get policy() {
    if (!this._policy) {
      this._policy = new AccessControl(this._grants).lock();
      console.log(this._policy._grants.CUSTOMER);
    }
    return this._policy;
  }

  visitObject(type) {
    this._grants.push(
      ...this.args.rules.map(({ role, possession, attributes }) => ({
        role,
        resource: type.name,
        action: "read",
        possession,
        attributes,
      }))
    );

    Object.values(type.getFields()).forEach((field) =>
      patchResolver(field, (resolver) => this.createAuthResolver(resolver))
    );
  }

  canRead(claims, resource, owner, attribute, result) {
    const isOwner = owner === claims.subject;

    if (isOwner) {
      return this.policy
        .can(claims.roles)
        .readOwn(resource)
        .filter({ [attribute]: result })[attribute];
    } else {
      return this.policy
        .can(claims.roles)
        .readAny(resource)
        .filter({ [attribute]: result })[attribute];
    }
  }

  createAuthResolver(resolver) {
    return async (parent, args, context, info) => {
      const result = await resolver(parent, args, context, info);
      const isOwner = parent.owner === context.claims.subject;
      const readOwn = this.policy
        .can(context.claims.roles)
        .readOwn(info.parentType.name)
        .filter({ [info.fieldName]: result })[info.fieldName];
      const readAny = this.policy
        .can(context.claims.roles)
        .readAny(info.parentType.name)
        .filter({ [info.fieldName]: result })[info.fieldName];

      console.log({ isOwner, readOwn, readAny });
      return isOwner ? readOwn : readAny;
    };
  }
}

module.exports = AuthDirective;
