const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const { AccessControl } = require("accesscontrol");
const { Glob } = require("notation");

const patternMatches = (patterns, fieldName) => {
  let accepted = false;
  for (const pattern of Glob.normalize(patterns)) {
    const glob = Glob.create(pattern);
    if (glob.isNegated) {
      accepted &= glob.test(fieldName);
    } else {
      accepted |= glob.test(fieldName);
    }
  }
  return accepted;
};

const canAccept = ({ policy, resource, roles, action, isOwner, attribute }) => {
  const methodName = `${action}${isOwner ? "Own" : "Any"}`;
  const { attributes } = policy.can(roles)[methodName](resource);
  return patternMatches(attributes, attribute);
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

    for (const field of Object.values(type.getFields())) {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async (parent, args, context, info) => {
        const result = await resolve(parent, args, context, info);
        return canAccept({
          policy: this.policy,
          resource: info.parentType.name,
          roles: context.claims.roles,
          action: "read",
          attribute: info.fieldName,
          isOwner: parent.owner === context.claims.subject,
        }) ? result : null;
      };
    }
  }
}

module.exports = AuthDirective;
