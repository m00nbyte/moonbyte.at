import { FormResponse, FormText } from '@root/types';

// #region textarea
const minHeight = 208;
let staticOffset = 0;
let lastMousePos = 0;

/**
 * Starts the drag event to resize the textarea. It sets the initial conditions for
 * dragging, including recording the mouse position and setting up event listeners for
 * mouse movement and release.
 *
 * @param {HTMLTextAreaElement} container - The textarea element being resized.
 * @param {MouseEvent} event - The mouse event that triggers the start of dragging.
 * @returns {boolean} Always returns false to prevent default behavior.
 */
const startDrag = (container: HTMLTextAreaElement, { clientY }: MouseEvent): boolean => {
    const {
        documentElement: { scrollTop }
    } = document;

    container.blur();
    container.style.opacity = '0.25';

    lastMousePos = clientY + scrollTop;
    staticOffset = +container.style.height.slice(0, -2) - lastMousePos;

    document.onmousemove = (event) => performDrag(container, event);
    document.onmouseup = () => endDrag(container);

    return false;
};

/**
 * Performs the actual resizing of the textarea as the user drags the mouse.
 * It calculates the new height based on the current mouse position and updates the textarea's height.
 *
 * @param {HTMLTextAreaElement} container - The textarea element being resized.
 * @param {MouseEvent} event - The mouse event that occurs during the drag.
 * @returns {boolean} Returns false if the minimum height is reached to end the drag.
 */
const performDrag = (container: HTMLTextAreaElement, { clientY }: MouseEvent): boolean => {
    const {
        documentElement: { scrollTop }
    } = document;

    const tmpMousePos = clientY + scrollTop;
    let newMousePos = staticOffset + tmpMousePos;

    if (lastMousePos >= tmpMousePos) {
        newMousePos -= 5;
    }

    lastMousePos = newMousePos;
    newMousePos = Math.max(minHeight, newMousePos);
    container.style.height = `${newMousePos}px`;

    return newMousePos < minHeight && endDrag(container);
};

/**
 * Ends the drag event for resizing the textarea by removing the mouse event listeners
 * and restoring the textarea's opacity and focus.
 *
 * @param {HTMLTextAreaElement} container - The textarea element that was resized.
 * @returns {boolean} Always returns false to prevent default behavior.
 */
const endDrag = (container: HTMLTextAreaElement): boolean => {
    document.onmousemove = null;
    document.onmouseup = null;

    container.style.opacity = '1';
    container.focus();

    return false;
};

/**
 * Initializes the textarea resize functionality and the character count display.
 * Sets up event listeners to handle user input and the textarea resize mechanism.
 *
 * @returns {void} This function has no output.
 */
const initializeTextarea = (): void => {
    const textareaContainer = document.querySelector<HTMLTextAreaElement>('#message_box');
    const textareaElement = textareaContainer?.querySelector<HTMLTextAreaElement>('#message_input');
    const textareaGrab = textareaContainer?.querySelector<HTMLDivElement>('#message_grab');
    const textareaCount = document.querySelector<HTMLDivElement>('#message_count');
    if (!textareaContainer || !textareaElement || !textareaGrab || !textareaCount) return;

    textareaContainer.style.height = `${minHeight}px`;

    textareaElement.addEventListener('input', (e: Event): void => {
        const { value } = <HTMLTextAreaElement>e.target;
        textareaCount.textContent = (1000 - value.length).toString();
    });

    textareaGrab.addEventListener('mousedown', (event) => startDrag(textareaContainer, event));
};
// #endregion

// #region validation
const charRegex = /[0-9~`!@#$%^&()_={}[\]:;,.<>+/?-]/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const validators: { [key: string]: Function } = {
    name: (value: string) => {
        const trimmed = value.trim();

        return (
            (trimmed === '' && 'required') ||
            (trimmed.length < 3 && 'minLength') ||
            (trimmed.length > 100 && 'maxLength') ||
            (charRegex.test(trimmed) && 'invalidChars') ||
            null
        );
    },
    email: (value: string) => {
        const trimmed = value.trim();

        return (
            (trimmed === '' && 'required') ||
            (trimmed.length < 3 && 'minLength') ||
            (trimmed.length > 100 && 'maxLength') ||
            (!emailRegex.test(trimmed) && 'invalidEmail') ||
            null
        );
    },
    message: (value: string) => {
        const trimmed = value.trim();

        return (
            (trimmed === '' && 'required') ||
            (trimmed.length < 10 && 'minLength') ||
            (trimmed.length > 1000 && 'messageLimit') ||
            null
        );
    },
    privacy: (checked: boolean) => {
        return (!checked && 'checkbox') || null;
    }
};

/**
 * Validates a specific form field based on its name, type, and value.
 * If there is an error, it creates an error element and returns false; otherwise, it removes any existing errors.
 *
 * @param {FormText} strings - An object containing the error messages and response messages to display.
 * @param {HTMLInputElement} field - The form field to validate.
 * @returns {boolean} - Returns true if the field is valid, false otherwise.
 */
const validateField = (strings: FormText, field: HTMLInputElement): boolean => {
    const { name, type, value, checked } = field;

    const newValue = type === 'checkbox' ? checked : value;
    const hasError = validators[name.toLowerCase()]?.(newValue);

    if (hasError) {
        createErrorElement(field, <string>strings[hasError]);
    } else {
        removeErrorElement(<HTMLElement>field.parentElement);
    }

    return !hasError;
};

/**
 * Removes any existing error element associated with the given input or textarea field.
 *
 * @param {HTMLElement} parentElement - The parent element which contains the error element.
 * @returns {void} This function has no output.
 */
const removeErrorElement = (parentElement: HTMLElement): void => {
    if (!parentElement) return;

    const errorDiv = parentElement.querySelector<HTMLDivElement>('.input_error');

    if (errorDiv) {
        errorDiv.remove();
    }
};

/**
 * Creates and displays an error message associated with the given input or textarea field.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} field - The input or textarea field where the error occurred.
 * @param {string} error - The error message to display.
 * @returns {void} This function has no output.
 */
const createErrorElement = ({ type, parentElement }: HTMLInputElement | HTMLTextAreaElement, error: string): void => {
    if (!parentElement) return;

    removeErrorElement(parentElement);

    const divPosition = type === 'checkbox' ? '-top-0.5 right-0' : 'top-[0.6rem] right-2';

    const updateError = document.createElement('div');
    updateError.className = `input_error absolute flex flex-row items-center justify-center h-6 gap-2 pl-2 pr-2 text-xs shadow-xs bg-rose-800 ${divPosition}`;
    updateError.innerHTML = `<span>${error}</span><div class="icon-[fa--exclamation-circle]"></div>`;

    parentElement.appendChild(updateError);
};

/**
 * Creates and displays a response message after form submission, indicating success or failure.
 * If the submission is successful, the form is reset after the message is shown.
 *
 * @param {HTMLFormElement} form - The form element to which the response message is related.
 * @param {object} response - The response data containing success status and content.
 * @param {boolean} response.success - A flag indicating whether the form submission was successful.
 * @param {object} response.content - An object containing the title, message, and color for the response message.
 * @param {string} response.content.title - The title of the response message.
 * @param {string} response.content.message - The content of the response message.
 * @param {string} response.content.color - The color class for styling the response message.
 * @returns {void} This function has no output.
 */
const createFormResponse = (
    form: HTMLFormElement,
    {
        success,
        content: { title, message, color }
    }: {
        success: boolean;
        content: {
            title: string;
            message: string;
            color: string;
        };
    }
): void => {
    const formSubmit = form.querySelector<HTMLDivElement>('#form_submit');
    if (!formSubmit) return;

    const formResponse = document.createElement('div');
    formResponse.id = 'form_response';
    formResponse.className = `absolute flex-row flex items-center w-full gap-3 top-0 px-3 py-2.5 shadow-xs cursor-default ${color}`;
    formResponse.innerHTML = `<span class="text-lg font-bold tracking-tight">${title}</span><span class="text-base">${message}</span>`;

    formSubmit.appendChild(formResponse);

    setTimeout(() => {
        formResponse.remove();

        if (success) {
            form.reset();
        }
    }, 3000);
};
// #endregion

// #region init
/**
 * Initializes the contact form by setting up validation for its fields and handling
 * the submission process. It adds event listeners to validate fields on input or change
 * events and processes the form submission using the Fetch API.
 *
 * @param {FormText} strings - An object containing the error messages and response messages to display.
 * @returns {void} This function has no output.
 */
const initializeForm = (strings: FormText): void => {
    const formContainer = document.querySelector<HTMLFormElement>('#contact_form');
    if (!formContainer) return;

    const formElements = <HTMLInputElement[]>Array.from(formContainer.elements);
    if (!formElements.length) return;

    for (const element of formElements) {
        const { name, type } = element;

        if (validators[name.toLowerCase()]) {
            element.addEventListener(type === 'checkbox' ? 'change' : 'input', ({ target }) =>
                validateField(strings, <HTMLInputElement>target)
            );
        }
    }

    initializeTextarea();

    formContainer.addEventListener('submit', (event) => {
        event.preventDefault();

        if (formElements.every((item) => validateField(strings, item))) {
            const { formId, response: responseText } = strings;

            const formData = new FormData(formContainer);

            const handleResponse = (status: boolean) =>
                createFormResponse(formContainer, {
                    success: status,
                    content: <FormResponse>responseText[+status]
                });

            fetch(`https://form.taxi/s/${formId}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            })
                .then((response) => response.json())
                .then(({ success }) => handleResponse(success))
                .catch(() => handleResponse(false));
        }
    });
};
// #endregion

export { initializeForm };
