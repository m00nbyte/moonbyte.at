/**
 * Protects an email address displayed on the webpage by encoding it to prevent
 * web scrapers from harvesting the email. The email is encoded in a way that
 * it appears as text but is converted back to a clickable mailto link when clicked.
 *
 * @returns {void} This function has no output.
 */
const protectEmail = (): void => {
    const emailElement = document.querySelector<HTMLLinkElement>('.contact_email');
    if (!emailElement) return; // Exit if the email element is not found

    /**
     * Handles the click event on the email element. It decodes the encoded email
     * and updates the href attribute to create a mailto link.
     *
     * @returns {void} This function has no output.
     */
    const handleClick = (): void => {
        const encodedEmail = <string>emailElement.textContent;
        const decodedEmail = encodedEmail.replace('[at]', String.fromCharCode(64)).replace('[dot]', String.fromCharCode(46));

        emailElement.href = `mailto:${decodedEmail}`;
        emailElement.removeEventListener('click', handleClick);
    };

    emailElement.addEventListener('click', handleClick);
};

export { protectEmail };
