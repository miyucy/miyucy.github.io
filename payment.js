document.addEventListener("DOMContentLoaded", () => {
  if ("PaymentRequest" in window) {
    try {
      let supportedInstruments = [
        {
          supportedMethods: ["basic-card"],
          data: {
            supportedNetworks: ["visa"]
          }
        }
      ];
      let details = {
        displayItems: [
          {
            label: "foo",
            amount: { currency: "JPY", value: "1200" }
          },
          {
            label: "bar",
            amount: { currency: "JPY", value: "34" }
          }
        ],
        total: {
          label: "Total due",
          amount: { currency: "JPY", value: "1234" }
        }
      };
      let paymentOptions = {};
      let paymentRequest = new window.PaymentRequest(supportedInstruments, details, paymentOptions);
      paymentRequest
        .show()
        .then(response => {
          console.log(response);
          debugger;
        })
        .catch(error => console.error(error));
    } catch (e) {
      console.log(e);
    }
  }
});
