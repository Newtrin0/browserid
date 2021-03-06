/*globals BrowserID: true */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla BrowserID.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
BrowserID.Validation = (function() {
  var bid = BrowserID,
      tooltip = bid.Tooltip;

  bid.verifyEmail = function(address) {
    // Original gotten from http://blog.gerv.net/2011/05/html5_email_address_regexp/
    // changed the requirement that there must be a ldh-str because BrowserID
    // is only used on internet based networks.
    var parts = address.split("@");

    return /^[\w.!#$%&'*+\-/=?\^`{|}~]+@[a-z\d-]+(\.[a-z\d-]+)+$/i.test(address)
           // total address allwed to be 254 bytes long
           && address.length <= 254
           // local side only allowed to be 64 bytes long
           && parts[0] && parts[0].length <= 64
           // domain side allowed to be up to 253 bytes long
           && parts[1] && parts[1].length <= 253;
  };


  function validateEmail(email) {
    var valid = false;

    if (!email) {
      tooltip.showTooltip("#email_required");
    }
    else if (!bid.verifyEmail(email)) {
      tooltip.showTooltip("#email_format");
    }
    else {
      valid = true;
    }

    return valid;
  }

  function validateEmailAndPassword(email, password) {
    var valid = validateEmail(email);

    if (valid) {
      valid = passwordExists(password);
    }

    return valid;
  }

  function passwordExists(password) {
    var valid = !!password;

    if (!valid) {
      tooltip.showTooltip("#password_required");
    }

    return valid;
  }

  function passwordLength(password) {
    var valid = password && (password.length >= 8);

    if(!valid) {
      tooltip.showTooltip("#password_too_short");
    }

    return valid;
  }

  function validationPasswordExists(vpass) {
    var valid = !!vpass;

    if(!valid) {
      tooltip.showTooltip("#vpassword_required");
    }

    return valid;
  }

  function passwordAndValidationPassword(pass, vpass) {
    var valid = passwordExists(pass) && passwordLength(pass) && validationPasswordExists(vpass);

    if (valid && pass !== vpass) {
      valid = false;
      tooltip.showTooltip("#passwords_no_match");
    }

    return valid;
  }

  return {
    email: validateEmail,
    password: passwordExists,
    emailAndPassword: validateEmailAndPassword,
    passwordAndValidationPassword: passwordAndValidationPassword
  };

}());

