import moment from "moment";
import { titleCase } from "./string-manipulation";

function getTaxDetails(installmentInfo) {
  const toReturn = [];

  const feeCollected = installmentInfo.feeCollected;
  const withOutTax = feeCollected / 1.18;
  const withOutTaxRounded = Math.round(withOutTax * 100) / 100;
  const totalTax = feeCollected - withOutTaxRounded;
  const halfTax = totalTax / 2;
  const halfTaxRounded = Math.round(halfTax * 100) / 100;

  toReturn.push(" ");
  toReturn.push(withOutTaxRounded);
  toReturn.push(halfTaxRounded);
  toReturn.push(halfTaxRounded);
  return toReturn;
}

function getDateAndReceiptNumber() {
  const date = moment().format("MMM Do YY");
  const dateMilliSec = moment().valueOf();
  return [
    { text: "Dated", style: "bigger" },
    { text: date },
    { text: "Receipt Number", style: "bigger" },
    { text: dateMilliSec },
    { text: "Place of Supply", style: "bigger" },
    "Delhi"
  ];
}

function getDescription(installmentInfo) {
  const names = [
    "Course Code/Name: " + installmentInfo.courseCode,
    "Total Amount before tax",
    "Add CGST: 9%",
    "Add SGST: 9%"
  ];

  return [
    {
      width: "*",
      stack: names,
      style: "m1"
    }
  ];
}

function getPaymentMethodDetails(installmentInfo) {
  const names = [];
  const values = [];
  names.push("Mode Of Payment:");
  values.push(installmentInfo.modeOfPayment);

  if (installmentInfo.modeOfPayment === "card") {
    const { bank, transactionId } = installmentInfo;
    if (bank) {
      names.push("Bank Name");
      values.push(bank);
    }
    if (transactionId) {
      names.push("Transaction ID");
      values.push(transactionId);
    }
  } else if (installmentInfo.modeOfPayment === "cheque") {
    const { date, bank, chequeNumber } = installmentInfo;
    if (date) {
      names.push("Date of Cheque");
      values.push(date.format("MMM Do YY"));
    }
    if (bank) {
      names.push("Bank Name");
      values.push(bank);
    }
    if (chequeNumber) {
      names.push("Cheque Number");
      values.push(chequeNumber);
    }
  } else {
    const { transactionId } = installmentInfo;
    if (transactionId) {
      names.push("Transaction ID");
      values.push(transactionId);
    }
  }

  return [
    {
      width: "*",
      stack: names,
      style: "m1"
    },
    {
      alignment: "right",
      width: "*",
      stack: values,
      style: "m1"
    }
  ];
}

function getTotalCollection(installmentInfo) {
  return installmentInfo.feeCollected;
}

function getGSTNumber(receiptConfig) {
  const toReturn = [];
  const { receiptConfigGstNumber } = receiptConfig;
  if (receiptConfigGstNumber)
    toReturn.push({
      text: "Tax/GST Number: " + receiptConfigGstNumber
    });

  return toReturn;
}

function getTuitionDetails(receiptConfig) {
  const toReturn = [];
  const {
    receiptConfigBusinessName,
    receiptConfigAddressLine1,
    receiptConfigAddressLine2,
    receiptConfigState,
    receiptConfigPinCode,
    receiptConfigGstNumber
  } = receiptConfig;
  if (receiptConfigBusinessName)
    toReturn.push({ text: receiptConfigBusinessName, style: "bigger" });
  if (receiptConfigAddressLine1) toReturn.push(receiptConfigAddressLine1);
  if (receiptConfigAddressLine2) toReturn.push(receiptConfigAddressLine2);
  if (receiptConfigState) toReturn.push(receiptConfigState);
  if (receiptConfigPinCode)
    toReturn[toReturn.length - 1] =
      toReturn[toReturn.length - 1] + ", " + receiptConfigPinCode;
  return toReturn;
}

function getStudentDetails(studentInfo) {
  const toReturn = [{ text: "Student details", style: "bigger" }];
  toReturn.push(
    titleCase(studentInfo.name),
    "Roll No: " + studentInfo.rollNumber,
    { text: "Email: " + studentInfo.email, style: "mb1" },
    "State: Delhi"
  );
  return toReturn;
}

function getTermsNConditions(receiptInfo) {
  return [
    "Any changes in Govt. levies/taxes on fees will be borne by the student.",
    "The validity of this receipt is subject to the realization of cheque/pay order/DD.",
    "Fee once paid will NOT BE REFUNDED in any case, except, when the company decides to cancel the product which may happen at the sole discretion of the company."
  ];
}

export function getDocDef(receiptConfig, studentInfo, installmentInfo) {
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 20, 40, 60],
    footer: {
      fontSize: 10,
      margin: [40, 0, 0, 0],
      stack: [
        {
          text:
            "This is an electronic receipt and does not require a physical stamp or signature.",
          alignment: "center"
        },
        {
          text: "STUDY MONITOR APP powered by EDUATLAS.COM",
          alignment: "center",
          fontSize: "12",
          style: "mt1"
        }
      ]
    },
    content: [
      {
        style: "my1",
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                stack: getGSTNumber(receiptConfig)
              }
            ]
          ]
        }
      },
      {
        style: "mb1",
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                alignment: "center",
                stack: getTuitionDetails(receiptConfig)
              }
            ]
          ]
        }
      },
      {
        margin: [0, 0, 0, 5],
        alignment: "center",
        style: "header",
        text: "Receipt"
      },
      {
        alignment: "justify",
        columns: [
          {
            width: "*",
            stack: getStudentDetails(studentInfo)
          },
          {
            alignment: "right",
            width: "*",
            stack: getDateAndReceiptNumber()
          }
        ]
      },
      {
        margin: [0, 20, 0, 0],
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              {
                alignment: "center",
                text: "Details/Description",
                bold: true
              },
              {
                alignment: "right",
                text: "Amount",
                bold: true
              }
            ],
            [
              { columns: getDescription(installmentInfo) },
              {
                alignment: "right",
                stack: getTaxDetails(installmentInfo),
                style: "m1"
              }
            ],
            [
              {
                columns: [
                  {
                    width: "*",
                    stack: [{ text: "Total after tax", bold: true }],
                    style: "mx1"
                  }
                ]
              },
              {
                alignment: "right",
                text: getTotalCollection(installmentInfo),
                bold: true,
                style: "mx1"
              }
            ],
            [
              {
                columns: [
                  {
                    width: "*",
                    stack: [{ text: "Amount collected", bold: true }],
                    style: "mx1"
                  }
                ]
              },
              {
                alignment: "right",
                text: getTotalCollection(installmentInfo),
                bold: true,
                style: "mx1"
              }
            ]
          ]
        }
      },
      {
        style: "my1",
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                columns: getPaymentMethodDetails(installmentInfo)
              }
            ]
          ]
        }
      },
      {
        style: "mb1",
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                text: "Amount Collected in words:",
                style: "m1"
              }
            ]
          ]
        }
      },
      {
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                text: "Remarks:",
                margin: [10, 10, 10, 30],
              }
            ]
          ]
        }
      },
      {
        stack: [
          {
            text: "INVOICE NOTES/ TERMS & CONDITIONS:",
            style: "bigger",
            margin: [0, 50, 0, 0]
          },
          {
            ol: getTermsNConditions(receiptConfig)
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true
      },
      bigger: {
        fontSize: 13,
        bold: true,
        margin: [0, 5, 0, 0]
      },
      mt2: {
        margin: [0, 20, 0, 0]
      },
      mt1: {
        margin: [0, 10, 0, 0]
      },
      mb1: {
        margin: [0, 0, 0, 10]
      },
      mb3: {
        margin: [0, 0, 0, 30]
      },
      my1: {
        margin: [0, 10, 0, 10]
      },
      mx1: {
        margin: [10, 0, 10, 0]
      },
      m1: {
        margin: [10, 10, 10, 10]
      },
      alignMid: {
        align: "center"
      }
    },
    defaultStyle: {
      columnGap: 30
    }
  };

  return docDefinition;
}

// function downloadPDF() {
// 	pdfMake.createPdf(docDefinition).download('receipt.pdf');
// }
