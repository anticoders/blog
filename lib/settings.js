
/**
 * A safe accessor for the Meteor.settings object.
 */

Settings = _.partial(Utils.namespace, Meteor.settings);
