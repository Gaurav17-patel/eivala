import constantUtils from "./ConstantUtils";
import WebService from "./WebService";
import PreferenceManager from "./PreferenceManager";
import PreferenceKey from "./PreferenceKey";
import functionUtils from "./FunctionUtils";

const TAG = "ApiUtils";

class ApiUtils {
  static headers() {
    return {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };
  }

  static XDomain(domain) {
    return {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "X-DOMAIN": domain,
    };
  }

  static get(route) {
    return this.webserviceExplorer(route, null, "GET");
  }

  static getWithToken(route, token) {
    return this.webserviceWithToken(route, null, token, "GET");
  }

  static getWithTokenPaginationList(route, token) {
    return this.webserviceWithTokenForPagination(route, null, token, "GET");
  }

  static put(route, params) {
    return this.webserviceExplorer(route, params, "PUT");
  }

  static post(route, params) {
    return this.webserviceExplorer(route, params, "POST");
  }

  static postWithXdomin(route, params) {
    return this.webserviceExplorer(route, params, "POST", true);
  }

  static postWithToken(route, params, token) {
    return this.webserviceWithToken(route, params, token, "POST");
  }

  static delete(route, params) {
    return this.webserviceExplorer(route, params, "DELETE");
  }

  static async webserviceExplorer(route, params, verb, isExDomain) {
    const host = WebService.BASE_URL;
    const url = `${host}${route}`;
    var xDomain = await PreferenceManager.getPreferenceValue(
      PreferenceKey.XDOMAIN
    );

    let options = {
      method: verb,
      headers: isExDomain ? ApiUtils.XDomain(xDomain) : ApiUtils.headers(),
      body: params,
    };
    console.log(TAG, "url : ", url);
    console.log(TAG, "body :", options.body);
    return fetch(url, options)
      .then((resp) => {
        let json = resp.json();
        if (resp.ok) {
          return json;
        }
        return json.then((err) => {
          console.log("error :", err);
          if (err.status == 401) {
            functionUtils.clearData();
          }
          throw err;
        });
      })
      .then((json) => json);
  }

  static async webserviceWithToken(route, params, token, verb) {
    var user_token = await PreferenceManager.getPreferenceValue(
      PreferenceKey.USER_TOKEN
    );
    var xDomain = await PreferenceManager.getPreferenceValue(
      PreferenceKey.XDOMAIN
    );
    console.log("user_token :: ", user_token);
    const host = WebService.BASE_URL;
    const url = `${host}${route}`;

    let options = {
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + user_token,
        'X-DOMAIN': xDomain,
      },
      body: params,
    };
    console.log(TAG, "url : ", url);
    console.log(TAG, "method : ", options.method);
    console.log(TAG, "headers : ", JSON.stringify(options.headers));
    console.log(TAG, "body : ", JSON.stringify(options.body));
    return await fetch(url, options)
      .then((resp) => {
        let json = null;
        if (route == WebService.DOWNLOAD_DATA) {
          json = resp.blob();
        } else {
          json = resp.json();
        }
        if (resp.ok) {
          console.log("API utills response 1 -- >", json);
          return json;
        }
        return json.then((err) => {
          console.log("error :", err);
          if (err.status == 401) {
            functionUtils.clearData();
          }
          throw err;
        });
      })
      .then((json) => json);
  }

  static async webserviceWithTokenForPagination(route, params, token, verb) {
    var user_token = await PreferenceManager.getPreferenceValue(
      PreferenceKey.USER_TOKEN
    );
    var xDomain = await PreferenceManager.getPreferenceValue(
      PreferenceKey.XDOMAIN
    );
    console.log("user_token :: ", user_token);
    const url = `${route}`;

    let options = {
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + user_token,
        'X-DOMAIN': xDomain,
      },
      body: params,
    };
    console.log(TAG, "application url : ", url);
    console.log(TAG, "method : ", options.method);
    console.log(TAG, "headers : ", JSON.stringify(options.headers));
    console.log(TAG, "body : ", JSON.stringify(options.body));
    return await fetch(url, options)
      .then((resp) => {
        let json = null;
        if (route == WebService.DOWNLOAD_DATA) {
          json = resp.blob();
        } else {
          json = resp.json();
        }
        if (resp.ok) {
          console.log("API utills response 1 -- >", json);
          return json;
        }
        return json.then((err) => {
          console.log("error :", err);
          if (err.status == 401) {
            functionUtils.clearData();
          }
          throw err;
        });
      })
      .then((json) => json);
  }
}

export default ApiUtils;
