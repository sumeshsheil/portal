const LOGO_BASE64 = `iVBORw0KGgoAAAANSUhEUgAAB4AAAAMuCAMAAADPJe55AAADAFBMVEVMaXH/2wD/////////////2QD///////////+w/5r/////3AD/////////3AD/////3QD/////////3AD/////////////2wD/////3AD/////////1wD//////////wAB/2//////////////////3AD/////3QD/2gD/////////////////////3AD/////////////2wD/////////////////////////////////////////////////////4QD/////2gD/////////////3AD/////3gD/2wD/3AAB/3AA/3D/////////////////////////////////////////////////4AD/////3AD/3AD/2wD///////////8A/3H///////8A/3D/////////3AD/3AD/////////2gD/3AAA/2////////////////////////////////////8B/2////////////////////////////////////////////8B/28A/2//3AD/3AD/3AD///8B/2//////////3AD/////////3AAB/2//////3AD///////8A/28A/2//////////////3AD/////2wAA/28B/2//////3QD/3AD/2wD/////3AAB/3D/////2wD/2QD/3AAA/28A/2//3AAB/3AA/2////8A/3AB/28A/28B/3AA/3AB/28B/3AB/3AA/28B/2//3QAA/28A/28A/3L/3AD/3AD///8A/3AA/28B/3D/3AD/////3AAB/2//3AD/////3AAB/3D/3AAB/2//2wAB/3D/3AD/3AAB/3AA/28B/2//3AD/3AD/2gAA/3D/3QD/3AAB/28B/2////8A/3D/3QD/3AD/////3AD/2wAB/3AA/3D/3AAA/28B/2//3AD/////////3AD/2wD/2wAA/3D/3QD/3wD/3AD/////1AD/3AD/3AAA/2//2wAB/2//3AD/3AD/1wAB/3D/////3AAqNLM+AAAA/XRSTlMA/v73VSJm7t0BA6H8QzMIPPoZx5qIELss+iLMBOLSAvtoKSSOhfN4CumLawJeq50LonMvSHmGdz6lvDe5rvXnEZc+Olex0RYo7x3+EA5P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`

export function getWelcomeEmailHtml(name: string) {
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
		@media (max-width:570px) {
			.row-content { width: 100% !important; }
			.column .border { display: none; }
			table { table-layout: fixed !important; }
			.stack .column { width: 100%; display: block; }
		}
	</style>
</head>
<body style="background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:20px;padding-top:20px;width:100%;">
																<div class="alignment" align="center">
																	<div style="max-width: 250px;"><img src="data:image/png;base64,${LOGO_BASE64}" style="display: block; height: auto; border: 0; width: 100%;" width="250" alt="Budget Travel Packages" title="Budget Travel Packages" height="auto"></div>
																</div>
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
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:35px;padding-right:10px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:24px;line-height:1.2;text-align:left;mso-line-height-alt:28.8px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Hi ${name},</span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:35px;padding-right:35px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:1.5;text-align:left;mso-line-height-alt:24px;">
																	<p style="margin: 0; word-break: break-word;">Thank you for choosing <strong>Budget Travel Packages</strong>! We have received your inquiry for your next adventure. Our team will get back to you shortly with the best options tailored to your needs.</p>
																</div>
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
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:35px;padding-right:10px;padding-top:20px;">
																<div style="color:#ea5256;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:18px;line-height:1.2;text-align:left;mso-line-height-alt:21.6px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;"><strong>Inquiry Details</strong></span></p>
																</div>
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
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:10px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Destination</span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:25px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${destination}</span></p>
																</div>
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
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:10px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Number of Travelers</span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:25px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${travelers}</span></p>
																</div>
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
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:10px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Budget</span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:25px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${budget}</span></p>
																</div>
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
					<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:10px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Phone Number</span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:25px;padding-top:10px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.5;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${phone}</span></p>
																</div>
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
					<table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:20px;padding-left:35px;padding-right:35px;padding-top:20px;">
																<div style="color:#232323;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:1.5;text-align:left;mso-line-height-alt:24px;">
																	<p style="margin: 0; word-break: break-word;">If you have any questions, feel free to contact us at <a href="mailto:hello@budgettravelpackages.in" style="color: #ea5256; text-decoration: none;">hello@budgettravelpackages.in</a>.</p>
																</div>
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
					<table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #007d9f; color: #000000; width: 550px; margin: 0 auto;" width="550">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-top:15px; text-align:center;">
																<div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:1.2;text-align:center;">
																	<p style="margin: 0; word-break: break-word;">Budget Travel Packages ™️ | All Rights Reserved</p>
																</div>
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
