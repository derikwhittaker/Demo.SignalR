var MVCClient;
(function (MVCClient) {
    // Module
    (function (Helpers) {
        // Class
        Helpers.ValidationConfiguration = {
            registerExtenders: true,
            messagesOnModified: true,
            insertMessages: false,
            parseInputAttributes: true,
            messageTemplate: null,
            decorateElement: true,
            errorElementClass: "prm-inline-field-validation-error"
        };
    })(MVCClient.Helpers || (MVCClient.Helpers = {}));
    var Helpers = MVCClient.Helpers;
})(MVCClient || (MVCClient = {}));
//# sourceMappingURL=Helpers.js.map
