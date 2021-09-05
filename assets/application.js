$(document).ready(function () {
  let moneySpanSelector = "span.money";
  let currencyPickerSelector = "[name=currencies]";
  let activeCurrencySelector = ".js-active-currency";
  let currencyNoteSelector = ".js-cart-currency-note";

  let currencyPicker = {
    loadCurrency: function () {
      $(`${moneySpanSelector} ${moneySpanSelector}`).each(function () {
        $(this).parents(moneySpanSelector).removeClass("money");
      });

      $(moneySpanSelector).each(function () {
        $(this).attr(`data-currency-${shopCurrency}`, $(this).html());
      });

      if (cookieCurrency == null) {
        if (shopCurrency !== defaultCurrency) {
          Currency.convertAll(shopCurrency, defaultCurrency);
        } else {
          Currency.currentCurrency = defaultCurrency;
        }
      } else if (
        $(currencyPickerSelector).length &&
        $(`${currencyPickerSelector} option[value=${cookieCurrency}]`)
          .length === 0
      ) {
        Currency.currentCurrency = shopCurrency;
        Currency.cookie.write(shopCurrency);
      } else if (cookieCurrency === shopCurrency) {
        Currency.currentCurrency = shopCurrency;
      } else {
        $(currencyPickerSelector).val(cookieCurrency);
        Currency.convertAll(shopCurrency, cookieCurrency);
      }

      currencyPicker.setCurrencyText();
    },
    onCurrencyChange: function (event) {
      let newCurrency = $(this).val();
      let $otherPickers = $(currencyPickerSelector).not($(this));

      Currency.convertAll(Currency.currentCurrency, newCurrency);
      currencyPicker.setCurrencyText(newCurrency);

      if ($otherPickers.length > 0) {
        $otherPickers.val(newCurrency);
      }
    },
    setCurrencyText: function (newCurrency = Currency.currentCurrency) {
      let $activeCurrency = $(activeCurrencySelector);
      let $currencyNote = $(currencyNoteSelector);

      if ($activeCurrency.length > 0) {
        $activeCurrency.text(newCurrency);
      }

      if ($currencyNote.length > 0) {
        if (newCurrency !== shopCurrency) {
          $currencyNote.show();
        } else {
          $currencyNote.hide();
        }
      }
    },
    onMoneySpanAdded: function () {
      Currency.convertAll(shopCurrency, Currency.currentCurrency);
      currencyPicker.setCurrencyText();
    },
    init: function () {
      if (showMultipleCurrencies !== true) {
        return false;
      }

      currencyPicker.loadCurrency();

      $(document).on(
        "change",
        currencyPickerSelector,
        currencyPicker.onCurrencyChange
      );
    }
  };

  currencyPicker.init();
});
