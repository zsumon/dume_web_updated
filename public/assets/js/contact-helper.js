window.onload = async () => {
    console.log('loaded');

}

function contactFormOnSubmit() {
    const name = $('form input, textarea')[0].value;
    const phone = $('form input, textarea')[1].value;
    const text = $('form input, textarea')[2].value;

    const contactRef = db.collection('contact');

    /// needs a login...
}