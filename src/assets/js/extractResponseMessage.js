export default function extractResponseMessage(e) {
  let message;
  if (!e) {
    message = `Undefined error ${e}`;
  } else if (e?.response?.status === 400) {
    if (e?.response?.data) {
      message = e.response.data;
    } else {
      message = "Message from server wasn't found";
    }
  } else if (e?.response?.data?.message) {
    message = e.response.data.message;
  } else if (e?.response?.data?.error?.message) {
    message = e.response.data.error.message;
  } else if (e?.response?.data) {
    message = e.response.data;
  } else if (e?.response?.status) {
    if (e.response.status === 404) {
      message = "404 - URL wasn't found";
    } else {
      message = e.response.statusText;
    }
  } else if (e instanceof Error) {
    message = e.message;
  } else {
    message = e.hasOwnProperty("message") ? e.message : e;
  }
  if (process.env.NODE_ENV) {
    console.error(JSON.stringify(e, null, 2));
  }
  return message;
}
