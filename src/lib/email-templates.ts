const LOGO_BASE64 = `iVBORw0KGgoAAAANSUhEUgAAB4AAAAMuCAMAAADPJe55AAADAFBMVEVMaXH/2wD/////////////2QD///////////+w/5r/////3AD/////////3AD/////3QD/////////3AD/////////////2wD/////3AD/////////1wD//////////wAB/2//////////////////3AD/////3QD/2gD/////////////////////3AD/////////////2wD/////////////////////////////////////////////////////4QD/////2gD/////////////3AD/////3gD/2wD/3AAB/3AA/3D/////////////////////////////////////////////////4AD/////3AD/3AD/2wD///////////8A/3H///////8A/3D/////////3AD/3AD/////////2gD/3AAA/2////////////////////////////////////8B/2////////////////////////////////////////////8B/28A/2//3AD/3AD/3AD///8B/2//////////3AD/////////3AAB/2//////3AD///////8A/28A/2//////////////3AD/////2wAA/28B/2//////3QD/3AD/2wD/////3AAB/3D/////2wD/2QD/3AAA/28A/2//3AAB/3AA/2////8A/3AB/28A/28B/3AA/3AB/28B/3AB/3AA/28B/2//3QAA/28A/28A/3L/3AD/3AD///8A/3AA/28B/3D/3AD/////3AAB/2//3AD/////3AAB/3D/3AAB/2//2wAB/3D/3AD/3AAB/3AA/28B/2//3AD/3AD/2gAA/3D/3QD/3AAB/28B/2////8A/3D/3QD/3AD/////3AD/2wAB/3AA/3D/3AAA/28B/2//3AD/////////3AD/2wD/2wAA/3D/3QD/3wD/3AD/////1AD/3AD/3AAA/2//2wAB/2//3AD/3AD/1wAB/3D/////3AAqNLM+AAAA/XRSTlMA/v73VSJm7t0BA6H8QzMIPPoZx5qIELss+iLMBOLSAvtoKSSOhfN4CumLawJeq50LonMvSHmGdz6lvDe5rvXnEZc+Olex0RYo7x3+EA5P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`

export function getAgentWelcomeEmailHtml(name: string) {
  return `<!doctype html>
<html lang="en" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>Welcome to the Team - Budget Travel Packages</title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }

  </style>
  <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
  <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }

      .mj-column-per-25 {
        width: 25% !important;
        max-width: 25%;
      }

      .mj-column-per-33-33 {
        width: 33.33% !important;
        max-width: 33.33%;
      }
    }

  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-100 {
      width: 100% !important;
      max-width: 100%;
    }

    .moz-text-html .mj-column-per-50 {
      width: 50% !important;
      max-width: 50%;
    }

    .moz-text-html .mj-column-per-25 {
      width: 25% !important;
      max-width: 25%;
    }

    .moz-text-html .mj-column-per-33-33 {
      width: 33.33% !important;
      max-width: 33.33%;
    }

  </style>
  <style type="text/css">
    @media only screen and (max-width:479px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }

  </style>
</head>

<body style="word-spacing:normal;background-color:#ffffff;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Welcome to the Team! Let's build amazing travel experiences together.</div>
  <div aria-label="Welcome to Budget Travel Packages" aria-roledescription="email" style="background-color:#ffffff;" role="article" lang="en" dir="auto">
    <!-- Header Logo -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#007d9f;background-color:#007d9f;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f;background-color:#007d9f;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0 20px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:340px;">
                                <img alt="Budget Travel Packages Logo" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-2_budget-travel-packages-high-resolution-logo-transparent.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="340" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Hero Section -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png" color="#007d9f" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
    <div style="background:#007d9f url('https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png') center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;margin:0px auto;max-width:600px;">
      <div style="line-height:0;font-size:0;">
        <table align="center" background="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f url('https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png') center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0 0 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:60px;letter-spacing:-1px;line-height:0.8;text-align:center;color:#ffffff;">Admin Portal <br> is live !</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:600px;">
                                  <img alt="Travel Deals" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-3_02_Header_image_email.png" style="border:0;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600" height="auto">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><![endif]-->
    <!-- Greeting Section -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#007d9f;background-color:#007d9f;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f;background-color:#007d9f;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0 0 60px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="vertical-align:top;padding:0 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:20px;line-height:24px;text-align:center;color:#ffffff;">Hi ${name},</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:18px;line-height:24px;text-align:center;color:#ffffff;">We're excited to have you join our network of travel partners. Your partner portal is ready, and you can now start managing leads and bookings. Hot deals, cool escapes, and professional tools await you.</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Deals You'll Melt For -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fef8ec" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#fef8ec;background-color:#fef8ec;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fef8ec;background-color:#fef8ec;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:60px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:300px;" ><![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="vertical-align:middle;padding:0 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:10px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:40px;font-weight:700;line-height:1;text-align:left;color:#007d9f;">Tools for Success</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:18px;line-height:24px;text-align:left;color:#3c3c3c;">Manage your client inquiries, track booking progress, and access exclusive travel inventory from your personal dashboard. We're here to help you grow your business.</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:18px;font-weight:700;line-height:24px;text-align:left;color:#3c3c3c;">Access your dashboard anytime.</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                  <tbody>
                                    <tr>
                                      <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                        <a href="https://portal.budgettravelpackages.in/" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Go to Dashboard </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td><td class="" style="vertical-align:middle;width:300px;" ><![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:250px;">
                                <img alt="Hot Deals" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-5_03_Hot_Deals.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Footer -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#007d9f;background-color:#007d9f;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f;background-color:#007d9f;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.2;text-align:center;color:#ffffff;">
                          <p style="margin: 0; margin-bottom: 16px;">Budget Travel Packages ™️</p>
                          <p style="margin: 0; margin-bottom: 16px;">Bengal Eco Intelligent Park, EM Block, Sector V, Kolkata, West Bengal 700091</p>
                          <p style="margin: 0;">Copyright ©. All Rights Reserved.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
  </div>
</body>

</html>`;
}


export function getWelcomeEmailHtml(name: string) {
  return `<!doctype html>
<html lang="en" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>Welcome to Budget Travel Packages</title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }

  </style>
  <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
  <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }

      .mj-column-per-25 {
        width: 25% !important;
        max-width: 25%;
      }

      .mj-column-per-33-33 {
        width: 33.33% !important;
        max-width: 33.33%;
      }
    }

  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-100 {
      width: 100% !important;
      max-width: 100%;
    }

    .moz-text-html .mj-column-per-50 {
      width: 50% !important;
      max-width: 50%;
    }

    .moz-text-html .mj-column-per-25 {
      width: 25% !important;
      max-width: 25%;
    }

    .moz-text-html .mj-column-per-33-33 {
      width: 33.33% !important;
      max-width: 33.33%;
    }

  </style>
  <style type="text/css">
    @media only screen and (max-width:479px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }

  </style>
</head>

<body style="word-spacing:normal;background-color:#ffffff;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Travel Deals are live! Explore More, Spend Less!</div>
  <div aria-label="Welcome to Budget Travel Packages" aria-roledescription="email" style="background-color:#ffffff;" role="article" lang="en" dir="auto">
    <!-- Header Logo -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#007d9f;background-color:#007d9f;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f;background-color:#007d9f;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0 20px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:340px;">
                                <img alt="Budget Travel Packages Logo" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-2_budget-travel-packages-high-resolution-logo-transparent.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="340" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Hero Section -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png" color="#007d9f" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
    <div style="background:#007d9f url('https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png') center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;margin:0px auto;max-width:600px;">
      <div style="line-height:0;font-size:0;">
        <table align="center" background="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f url('https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-1_15_Background_Palms.png') center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0 0 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:60px;letter-spacing:-1px;line-height:0.8;text-align:center;color:#ffffff;">Travel Deals <br> are live !</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:600px;">
                                  <img alt="Travel Deals" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-3_02_Header_image_email.png" style="border:0;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600" height="auto">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><![endif]-->
    <!-- Greeting Section -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#007d9f;background-color:#007d9f;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f;background-color:#007d9f;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0 0 60px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="vertical-align:top;padding:0 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:20px;line-height:24px;text-align:center;color:#ffffff;">Hi ${name},</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:18px;line-height:24px;text-align:center;color:#ffffff;">Hot deals, Cool escapes and Sun-soaked memories await. Whether you're dreaming of island vibes or city adventures, we’ve got your next getaway ready to go.</div>
                              </td>
                            </tr>
                            <!-- Removed duplicate button here as per user request to reduce "same content twitch" -->
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Deals You'll Melt For -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fef8ec" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#fef8ec;background-color:#fef8ec;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fef8ec;background-color:#fef8ec;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:60px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:300px;" ><![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="vertical-align:middle;padding:0 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:10px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:40px;font-weight:700;line-height:1;text-align:left;color:#007d9f;">Deals You’ll Melt For</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:18px;line-height:24px;text-align:left;color:#3c3c3c;">This summer, the heat is on - and so are the savings! From sun-soaked beaches to cool mountain escapes, we've curated irresistible deals that will make your wanderlust sizzle.</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:18px;font-weight:700;line-height:24px;text-align:left;color:#3c3c3c;">Don’t wait - these deals are going fast.</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                  <tbody>
                                    <tr>
                                      <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                        <a href="https://budgettravelpackages.in/" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Book Your Escape Now </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td><td class="" style="vertical-align:middle;width:300px;" ><![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:250px;">
                                <img alt="Hot Deals" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-5_03_Hot_Deals.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Discover Places -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#d2d735" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#d2d735;background-color:#d2d735;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#d2d735;background-color:#d2d735;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:170px;">
                                <img alt="Take me" src="https://media3.giphy.com/media/v1.Y2lkPTIwZWI0ZTlkYzd1bzNzZXJscTUzMnU1a25wajJmYTRhOWd3MnoyMXZrY3I0bXl1MiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/1GROyD7wDR06QK8BJg/giphy.gif" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="170" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:40px;font-weight:700;line-height:1;text-align:center;color:#007d9f;">Discover Places</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 60px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:18px;line-height:24px;text-align:center;color:#3c3c3c;">Ready to explore the world like never before? From hidden gems off the beaten path to iconic destinations that take your breath away, <strong>Discover Places</strong> is your gateway to unforgettable adventures.</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:18px;font-weight:700;line-height:24px;text-align:center;color:#3c3c3c;">Inspiration starts here.</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:14px;line-height:24px;text-align:center;color:#3c3c3c;">Scroll, dream, and discover the next place that will steal your heart.</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Image Grid -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#d2d735" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#d2d735;background-color:#d2d735;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#d2d735;background-color:#d2d735;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:150px;" ><![endif]-->
              <div class="mj-column-per-25 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:100px;">
                                <img alt="Galapagos" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-6_06_Galapagos.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:100px;">
                                <img alt="Beach" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-7_08_Beach.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:250px;">
                                <img alt="Where to go" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-8_08_Where_to_go.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                          <tbody>
                            <tr>
                              <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                <a href="https://budgettravelpackages.in/blogs" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Discover More </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:150px;" ><![endif]-->
              <div class="mj-column-per-25 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:100px;">
                                <img alt="Surfing" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-9_05_Surfer.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:100px;">
                                <img alt="Underwater" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-10_07_Fishes.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Promo Picks of the Week -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:40px;font-weight:700;line-height:1;text-align:center;color:#007d9f;">Promo Picks of the Week</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:16px;line-height:24px;text-align:center;color:#3c3c3c;">Unwrap a new adventure every week! We've handpicked the <strong>best limited-time offers</strong> just for you - think dreamy destinations, unbeatable prices, and exclusive travel perks.</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:24px;text-align:center;color:#3c3c3c;">New deals drop everyday. Don't miss out - these offers won't last long!</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0 20px;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:186.648px;" ><![endif]-->
              <div class="mj-column-per-33-33 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="border:2px dotted #007d9f;vertical-align:top;padding:10px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                  <tbody>
                                    <tr>
                                      <td style="width:112px;">
                                        <img alt="Dreamy Beaches" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-11_09_Beach_and_boat.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="112" height="auto">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:24px;text-align:center;color:#3c3c3c;">Dreamy Beaches</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:12px;line-height:24px;text-align:center;color:#3c3c3c;">Experience the ultimate escape with our Dreamy Beaches tour! Save up to 20% on your packages.</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                  <tbody>
                                    <tr>
                                      <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                        <a href="https://budgettravelpackages.in/packages" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Save Now </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:186.648px;" ><![endif]-->
              <div class="mj-column-per-33-33 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="border:2px dotted #007d9f;vertical-align:top;padding:10px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                  <tbody>
                                    <tr>
                                      <td style="width:112px;">
                                        <img alt="Cocktail Party" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-12_10_Cocktail_Party.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="112" height="auto">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:24px;text-align:center;color:#3c3c3c;">The Cocktail Party</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:12px;line-height:24px;text-align:center;color:#3c3c3c;">Come aboard our Cocktail Party Tour and take this deal! Enjoy a free cocktail for each person!</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                  <tbody>
                                    <tr>
                                      <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                        <a href="https://budgettravelpackages.in/packages" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Save Now </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:186.648px;" ><![endif]-->
              <div class="mj-column-per-33-33 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="border:2px dotted #007d9f;vertical-align:top;padding:10px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                  <tbody>
                                    <tr>
                                      <td style="width:112px;">
                                        <img alt="Hiking Adventure" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-13_11_Walkin_adventure.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="112" height="auto">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:24px;text-align:center;color:#3c3c3c;">Hiking Adventure</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Arial, sans-serif;font-size:12px;line-height:24px;text-align:center;color:#3c3c3c;">Join our exciting Hiking Adventure Tour and enjoy 20% off your first and second booking!</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                  <tbody>
                                    <tr>
                                      <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                        <a href="https://budgettravelpackages.in/packages" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Save Now </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Let the Journey Begin -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:550px;">
                                <img alt="Let the Journey Begin" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-14_Let_the_Journey_Begin_.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <!-- Kept this "Discover More" but labeled it differently or kept it if it links to collections -->
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                          <tbody>
                            <tr>
                              <td align="center" bgcolor="#d2d735" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#d2d735;" valign="middle">
                                <a href="https://budgettravelpackages.in/collections" style="display:inline-block;background:#d2d735;color:#024f64;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Explore Collections </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Time to Fly -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#d2d735" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#d2d735;background-color:#d2d735;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#d2d735;background-color:#d2d735;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:200px;">
                                <img alt="Plane" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-15_Let_the_Journey_Begin.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="200" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:40px;font-weight:700;line-height:1;text-align:center;color:#007d9f;">Time to Fly, Contact Now!</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:16px;line-height:24px;text-align:center;color:#3c3c3c;">Your next adventure is calling and it's more affordable than ever. From tropical escapes to city breaks, our best deals are ready for takeoff. Don't wait, these offers are flying fast!</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                          <tbody>
                            <tr>
                              <td align="center" bgcolor="#007d9f" role="presentation" style="border:none;border-radius:30px;cursor:auto;mso-padding-alt:10px 25px;background:#007d9f;" valign="middle">
                                <a href="mailto:hello@budgettravelpackages.in" style="display:inline-block;background:#007d9f;color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:30px;" target="_blank"> Contact Us Now </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <!-- Footer -->
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#007d9f" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#007d9f;background-color:#007d9f;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007d9f;background-color:#007d9f;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:200px;">
                                <img alt="Logo" src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-2_budget-travel-packages-high-resolution-logo-transparent.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="200" height="auto">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                          <tbody>
                            <tr>
                              <td style="padding:4px;vertical-align:middle;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3b5998;border-radius:3px;width:30px;">
                                  <tbody>
                                    <tr>
                                      <td style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                        <a href="https://www.facebook.com/sharer/sharer.php?u=#" target="_blank">
                                          <img alt src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-17_facebook2x.png" style="border-radius:3px;display:block;" width="30">
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--[if mso | IE]></td><td><![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                          <tbody>
                            <tr>
                              <td style="padding:4px;vertical-align:middle;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3f729b;border-radius:3px;width:30px;">
                                  <tbody>
                                    <tr>
                                      <td style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                        <a href="#" target="_blank">
                                          <img alt src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-18_instagram2x.png" style="border-radius:3px;display:block;" width="30">
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--[if mso | IE]></td><td><![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                          <tbody>
                            <tr>
                              <td style="padding:4px;vertical-align:middle;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#55acee;border-radius:3px;width:30px;">
                                  <tbody>
                                    <tr>
                                      <td style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                        <a href="https://twitter.com/intent/tweet?url=#" target="_blank">
                                          <img alt src="https://ik.imagekit.io/rmsdevelopment/welcome-email/welcome-email-19_youtube2x.png" style="border-radius:3px;display:block;" width="30">
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:12px;line-height:24px;text-align:center;color:#ffffff;"><a href="#" style="color: #ffffff; text-decoration: none">Travel Blogs</a> | <a href="#" style="color: #ffffff; text-decoration: none">Travel Portal</a> | <a href="#" style="color: #ffffff; text-decoration: none">Legal Policies</a></div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:10px;line-height:24px;text-align:center;color:#ffffff;">Budget Travel Packages 📍<br> Bengal Eco Intelligent Park, RM Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Arial, sans-serif;font-size:10px;line-height:24px;text-align:center;color:#ffffff;">Copyright ©. All Rights Reserved.</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
  </div>
</body>

</html>
`;
}


export function getLeadConfirmationEmailHtml(name: string, destination: string, travelers: number, budget: string, phone: string) {
  return `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" lang="en">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><w:wordml><w:nthematestp/><w:alwaysshowplaceholdertext/></w:wordml></xml><![endif]-->
	<style>
		* { box-sizing: border-box; }
		body { margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; }
		a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
		#MessageViewBody a { color: inherit; text-decoration: none; }
		p { line-height: inherit }
		.desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
		.image_block img + div { display: none; }
		@media (max-width:700px) {
			.desktop_hide table.icons-inner { display: inline-block !important; }
			.icons-inner { text-align: center; }
			.icons-inner td { margin: 0 auto; }
			.mobile_hide { display: none; }
			.row-content { width: 100% !important; }
			.stack .column { width: 100%; display: block; }
			.mobile_hide { mso-hide: all; display: none; }
			.desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
			.row-9 .column-1 .col-pad { padding: 5px 15px !important; }
			.row-9 .column-2 .col-pad { padding: 5px 15px !important; }
			.row-9 .column-3 .col-pad { padding: 5px 15px !important; }
		}
	</style>
</head>
<body style="background-color: #fef8ec; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fef8ec;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="col-pad" style="padding-bottom:10px;padding-top:10px;">
																<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																			<div class="alignment" align="center">
																				<div style="max-width: 238px;"><img src="data:image/png;base64,${LOGO_BASE64}" style="display: block; height: auto; border: 0; width: 100%;" width="238" alt="Budget Travel Packages Logo" title="Budget Travel Packages Logo" height="auto"></div>
																			</div>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="col-pad" style="padding-bottom:5px;padding-top:5px;">
																<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="pad">
																			<h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 50px; font-weight: 700; letter-spacing: -2px; line-height: 1; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 50px;">Welcome to Budget Travel Packages, ${name}!</h1>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="col-pad" style="padding-bottom:20px;padding-left:30px;padding-right:30px;padding-top:20px;">
																<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td class="pad">
																			<div style="color:#ffffff;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:24px;">
																				<p style="margin: 0;">We&rsquo;re thrilled to have you here! Your journey to unforgettable destinations at the best prices starts now. Explore our curated travel packages and start planning your dream getaway.</p>
																			</div>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="col-pad" style="padding-bottom:5px;padding-top:5px;">
																<div class="spacer_block block-1" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
																<table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																			<div class="alignment" align="center">
																				<div style="max-width: 340px;"><img src="data:image/png;base64,${LOGO_BASE64}" style="display: block; height: auto; border: 0; width: 100%;" width="340" alt="Budget Travel Packages Logo" title="Budget Travel Packages Logo" height="auto"></div>
																			</div>
																		</td>
																	</tr>
																</table>
																<div class="spacer_block block-3" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
																<table class="social_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="pad">
																			<div class="alignment" align="center">
																				<table class="social-table" width="104px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																					<tr>
																						<td style="padding:0 2px 0 0;"><a href="https://www.facebook.com/budgettravelpackages" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t0/facebook2x.png" width="32" height="auto" alt="Facebook" title="facebook" style="display: block; height: auto; border: 0;"></a></td>
																						<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/budgettravelpackages.in" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t0/instagram2x.png" width="32" height="auto" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
																						<td style="padding:0 0 0 2px;"><a href="https://www.youtube.com/@budgettravelpackages" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t0/youtube2x.png" width="32" height="auto" alt="YouTube" title="YouTube" style="display: block; height: auto; border: 0;"></a></td>
																					</tr>
																				</table>
																			</div>
																		</td>
																	</tr>
																</table>
																<div class="spacer_block block-5" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
																<table class="menu_block mobile_hide block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="pad">
																			<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																				<tr>
																					<td class="alignment" style="text-align:center;font-size:0px;">
																						<div class="menu-links"><a href="https://budgettravelpackages.in/blogs" target="_blank" style="padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#ffffff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:normal;">Travel Blogs</a><a href="https://portal.budgettravelpackages.in/" target="_blank" style="padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#ffffff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:normal;"> Travel Portal</a><a href="https://budgettravelpackages.in/legal" target="_blank" style="padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#ffffff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:normal;">Legal Policies</a></div>
																					</td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-2" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="col-pad" style="padding-bottom:5px;padding-top:5px;">
																<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td class="pad" style="padding-bottom:10px;padding-left:60px;padding-right:60px;padding-top:10px;">
																			<div style="color:#ffffff;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
																				<p style="margin: 0; margin-bottom: 16px;">Budget Travel Packages ™️</p>
																				<p style="margin: 0; margin-bottom: 16px;">Bengal Eco Intelligent Park, EM Block,<br>Sector V, Bidhannagar, Kolkata,<br>West Bengal 700091</p>
																				<p style="margin: 0;">Copyright ©. All Rights Reserved.</p>
																			</div>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
`;
}

