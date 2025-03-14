# Chargify Documentation



## Generating token from the web application.

- Initialize chargify in the application.

   ` this.chargify = new window.Chargify();  `

- Now we need a container where our payment form will be generated. Lets suppose we are rendering creditcard form inside 'chargifyCreditCarit' selector inside the div.

```
	<form onSubmit={this.handleSubmit}>
		<div className="Payment__Chargify__Wrapper">
			<div id="chargifyCreditCard" className="chargify__Item">
            </div>
        </div>
    </form>
```

- Load the UI component generated by chargify. Here we provide all the information regarding public key, card type, server host and the fields and its styling.

```
    this.chargify.load({
        publicKey: 'chjs_gr345345ghgher',
    	type: 'card',
		serverHost: 'https://noteable.chargify.com',
        fields: {
			number: {
				selector: '#chargifyCreditCard',
				label: 'Card Number',
				color: '#391d4d',
				placeholder: 'xxxx xxxx xxxx xxxx',
				message: 'This field is not valid. Please update it.',
			},
    })

```
This will render the UI component in our application. All the credit card number validation, month validation are done by chargify itself.

- Handling the post request.
```
	handleSubmit(e) {
		e.preventDefault();

		this.chargify.token(
			this.chargifyForm.current,

			(token) => {
				const payload = {
					subscription: {
						product_handle: 'noteable_basic',
						customer_attributes: {
							first_name: 'Ram',
							last_name: 'Jackson',
							email: 'ram.jackson@gmail.com,
						},
						credit_card_attributes: {
							chargify_token: token,
						},
					},
				};

				this.setState({data: JSON.stringify(payload)});
                // send received token to the backend
                await postCreditCardDetail();
                // if successfull navigate to the welcome page or show error. 
			},

			(error) => {
				console.log('{host} token ERROR - err: ', error);
			}
		);
	}
```

- When form is submitted, chargify generate token using the form data with the help of chargify.token() method. On successful callback

    - It generate the token.
    - Token is send to the backend.
    - Backend uses that token to create payment profile and subscription. (Token last for 20 minutes)
    - If incase token expires than the backend will throw error and frontend will show token expire error to the users.
    - On successfull response, user is redirected to the welcome screen.

Payload that will be send to the backend will be something like this:
```
    subscription: {
        credit_card_attributes: {
            chargify_token: "tok_8b7fnjvsyw4xt6d7xdmt8j8x"
        },
        customer_attributes: {
            email: "ram.jackson@gmail.com"
            first_name: "ram"
            last_name: "jackson"
        },
        product_handle: "noteable_basic"
    }
```
