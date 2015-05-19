/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const ContentScriptParams = function(aTab, anInformationHolder) {
    "use strict";
    const contentScriptParams = {};
    contentScriptParams.conversionQuotes = anInformationHolder.getConversionQuotes();
    contentScriptParams.convertToCurrency = anInformationHolder.convertToCurrency;
    contentScriptParams.convertToCountry = anInformationHolder.convertToCountry;
    contentScriptParams.currencySymbols = anInformationHolder.getCurrencySymbols();
    contentScriptParams.customSymbols = anInformationHolder.customSymbols;
    contentScriptParams.monetarySeparatorSymbol = anInformationHolder.monetarySeparatorSymbol;
    contentScriptParams.enableOnStart = anInformationHolder.enableOnStart;
    contentScriptParams.excludedDomains = anInformationHolder.excludedDomains;
    contentScriptParams.enabledCurrencies = anInformationHolder.enabledCurrencies;
    contentScriptParams.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
    contentScriptParams.roundAmounts = anInformationHolder.roundPrices;
    contentScriptParams.currencySpacing = anInformationHolder.currencySpacing;
    contentScriptParams.showOriginalPrices = anInformationHolder.showOriginalPrices;
    contentScriptParams.beforeCurrencySymbol = anInformationHolder.beforeCurrencySymbol;
    contentScriptParams.tempConvertUnits = anInformationHolder.tempConvertUnits;
    contentScriptParams.monetaryGroupingSeparatorSymbol = anInformationHolder.monetaryGroupingSeparatorSymbol;
    if (aTab && typeof aTab.isEnabled != "undefined")  {
        contentScriptParams.isEnabled = aTab.isEnabled;
    }
    else {
        contentScriptParams.isEnabled = anInformationHolder.conversionEnabled;
    }
    contentScriptParams.currencyNames = anInformationHolder.getCurrencyNames();
    return contentScriptParams;
};

if (typeof exports === "object") {
    exports.ContentScriptParams = ContentScriptParams;
}
