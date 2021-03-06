/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxChromeInterface = function(_, Panel, ToggleButton, eventAggregator) {
    "use strict";
/*
    const _ = require("sdk/l10n").get;
    const {Panel} = require("sdk/panel");
    const {ToggleButton} = require("sdk/ui");
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
*/
    const onHideToolsPanel = () => {
        toolsButton.state('window', {checked: false});
    };
    const toolsPanel = new Panel({
        width: 400,
        height: 200,
        contentURL: "./panel.html",
        contentStyleFile: "./panel-style.css",
        onHide: onHideToolsPanel
    });
    toolsPanel.port.on("showSettingsTab", () => {
        eventAggregator.publish("showSettingsTab");
        toolsPanel.hide();
    });
    toolsPanel.port.on("showTestTab", () => {
        eventAggregator.publish("showTestTab");
        toolsPanel.hide();
    });
    toolsPanel.port.on("showQuotesTab", () => {
        eventAggregator.publish("showQuotesTab");
        toolsPanel.hide();
    });
    const toolsIcon = {
        "16": "./images/1402782691_repair_cost.png",
        "32": "./images/1402782677_repair_cost.png",
        "64": "./images/1402782661_repair_cost.png"
    };
    const onToolsButtonChange = (aState) => {
        if (aState.checked) {
            toolsPanel.show({
                position: toolsButton
            });
        }
    };
    const toolsButton = new ToggleButton({
        checked: false,
        id: "direct-currency-converter-action-button",
        label: _("Open settings"),
        icon: toolsIcon,
        onChange: onToolsButtonChange
    });
    const conversionIcon = {
        "16": "./images/1402781551_currency_exchange_1.png",
        "32": "./images/1402781537_currency_exchange_1.png",
        "64": "./images/1402781517_currency_exchange_1.png"
    };
    const onConversionButtonClick = (aState) => {
        eventAggregator.publish("toggleConversion", aState.checked);
    };
    const conversionButton = new ToggleButton({
        checked: false,
        id: "direct-currency-converter-toggle-button",
        label: _("Toggle currency conversion"),
        icon: conversionIcon,
        onClick: onConversionButtonClick
    });
    // console.log("FirefoxChromeInterface initialised");
    return {
        setConversionButtonState: (anEnabled) => {
            conversionButton.checked = anEnabled;
        },
        setToolsButtonText: (aQuoteString) => {
            toolsButton.label = _("Open settings") + "\n" + aQuoteString;
        }
    }
};

if (typeof exports === "object") {
    exports.FirefoxChromeInterface = FirefoxChromeInterface;
}
