const {
  SchemaDirectiveVisitor,
} = require("apollo-server");
const { SchemaDirectiveVisitor } = require("apollo-server");
const { AccessControl } = require("accesscontrol");

class AuthDirective extends SchemaDirectiveVisitor {
  constructor(...args) {
    super(...args);
    this._grants = [];
    this._policy = null;
  }

  get policy() {
    if (!this._policy) {
      this._policy = new AccessControl(this._grants).lock();
    }
    return this._policy;
  }

  visitFieldDefinition(field, { objectType }) {
    const { roles, possession } = this.args;
    const resource = `${objectType.name}:${field.name}`;
    const grants = roles.map((role) => ({
      role,
      resource: `${objectType.name}.${field.name}`,
      action: "read",
      possession,
      attributes: ["*"],
    }));
    this._grants.push(...grants);
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (parent, args, context, info) {
      console.log(defaultFieldResolver);
      console.log(resolve === defaultFieldResolver);
      ;
      const result = await resolve.apply(this, [parent, args, context, info]);
      console.log("test2");
      if (
        context.claims &&
        context.claims.roles.some((role) => {
          return (
            (result.owner === context.claims.sub &&
              this.policy.can(role).readOwn(resource).granted) ||
            this.policy.can(role).readAny(resource).granted
          );
        })
      ) {
        console.log("test3");
        return result;
      }
      return null;
    };
  }
}

module.exports = AuthDirective;
