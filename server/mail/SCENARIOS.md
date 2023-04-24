# KappaSupport mailer

## Command /mailgun/send

* DTO validation
    - If DTO is not valid - Returns 422
* DTO data transforms
    - Set "from" attribute instead of sender (from is Python keyword)
* If dto_in.template_name
    - If template with given name do not exist - Returns 400
    - If error while rendering template - Return 400
    - Render template and set it as dto_in.html
* If any of text, html, template_name attribute is not set - Returns 400
    - (This is also part of DTO validation, but html attrs should be set after template rendering.)
* If not dto_in.text
    - Parse text from dto_in.html and set is as dto_in.text
* Get http client session with MailGun auth set from config
* Make a POST request to mail MailGun API with request data based on dto_in data
* Parse response and transform it to DTO out

## Command /mailchimp/send

## Command /smtp/send

## Command /default/send
