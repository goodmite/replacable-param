const $ = window.$;
export function formatTemplateMessage(message, data, msgBox) {
  if (message.toLowerCase().indexOf("@@system.customer_name@@") > -1) {
    message = message.replace(
      "@@system.customer_name@@",
      data.profile.customername !== "" &&
        data.profile.customername !== undefined
        ? data.profile.customername
        : "<system.customer_name>"
    );
  }
  if (message.toLowerCase().indexOf("@@system.customer_id@@") > -1) {
    message = message.replace(
      "@@system.customer_id@@",
      data.profile.customerid !== "" && data.profile.customerid !== undefined
        ? data.profile.customerid
        : "<system.customer_id>"
    );
  }
  if (message.toLowerCase().indexOf("@@system.customer_email_address@@") > -1) {
    message = message.replace(
      "@@system.customer_email_address@@",
      data.profile.emailid !== "" && data.profile.emailid !== undefined
        ? data.profile.emailid.split(",")[0]
        : "<system.customer_email_address>"
    );
  }
  if (message.toLowerCase().indexOf("@@system.asset@@") > -1) {
    message = message.replace(
      "@@system.asset@@",
      data.profile.sourceid !== "" && data.profile.sourceid !== undefined
        ? data.profile.sourceid
        : "<system.asset>"
    );
  }
  if (message.toLowerCase().indexOf("@@system.customer.mobile_no@@") > -1) {
    message = message.replace(
      "@@system.customer.mobile_no@@",
      data.profile.mobileno !== "" && data.profile.mobileno !== undefined
        ? data.profile.mobileno.split(",")[0]
        : "<system.customer.mobile_no>"
    );
  }
  message = msgBox.parseMessage(message);
  return message;
}
