# ItalianDocsValidationJs

The **ItalianDocsValidation** library is a versatile tool designed to handle the validation and generation of Italian tax codes and related documents. It offers a range of functions that simplify the management of Italian document data, making it an invaluable asset for developers working on projects involving Italian documents.

## Twin Libraries: ItalianDocsValidation

The **ItalianDocsValidation** library is part of a twin set of libraries designed to provide seamless validation and handling of Italian tax codes and related documents. It has a sibling library written in Java that offers similar functionalities for Java-based projects.

The Java counterpart, known as **ItalianDocsValidationJava**, offers developers working in the Java environment a powerful tool to manage Italian document data, just like its JavaScript counterpart does for JavaScript-based projects. Both libraries share a common goal of simplifying the validation, generation, and extraction of Italian document information, making them valuable resources for developers dealing with Italian documents in different programming languages.

For more information about the Java twin library, please visit the [ItalianDocsValidationJava repository](https://github.com/orlandolorenzo724/ItalianDocsValidationJava).


### (Alpha) Version 0.1.0

## Installation

Install the library using npm:

```bash
npm install italiandocsvalidationjs
```

## Usage
Here's how you can use the library to generate a Codice Fiscale starting from an object of type Person:

```javascript

import {
  generateCodiceFiscale,
  isLastNameValid,
  isFirstNameValid,
  reverseCodiceFiscale,
} from 'italian-docs-validation-js';

const person = {
  firstName: 'Mario',
  lastName: 'Rossi',
  birthday: '11/02/1999',
  birthplace: 'Milano',
  birthplaceInitials: 'MI',
  gender: 'M',
};

const codiceFiscale = generateCodiceFiscale(person);
console.log('Generated Codice Fiscale:', codiceFiscale);

// You can also use the validation functions
const isValidLastName = isLastNameValid('Rossi');
console.log('Is Last Name Valid:', isValidLastName);

const isValidFirstName = isFirstNameValid('Mario');
console.log('Is First Name Valid:', isValidFirstName);

// Reverse the process to extract information from a Codice Fiscale
const reversedPerson = reverseCodiceFiscale(codiceFiscale);
console.log('Reversed Person:', reversedPerson);

```

For more detailed information about each function and their usage, refer to the library's documentation.

## Contributions

This library is open source and welcomes contributions from the community. If you're interested in improving the library, adding new features, or fixing issues, you're invited to participate. Both beginners and experts are welcome!

### How to Contribute

1. Fork the [repository](https://github.com/Underscore2/ItalianDocsValidationJs) and clone your fork to your local machine.
2. Create a new branch for your work: `git checkout -b feature/your-feature`,`git checkout -b ref/your-refactoring`.
3. Make your changes and additions to the code.
4. Ensure the code is well tested and all tests pass.
5. Commit your changes: `git commit -m "feat(FILE || CROSS): description"`, `git commit -m "ref(FILE || CROSS): description"` .
6. Push your branch to your fork: `git push origin feat/new-feature`.
7. Submit a pull request to the main repository.
8. Await feedback and collaborate with the community to review and improve your work.

### Contribution Guidelines

- Make sure your code follows the project's coding standards.
- Add appropriate tests for any new features or changes you introduce (JEST).
- Keep the documentation up to date with any significant changes.
- Be respectful and collaborative with other contributors.

Feel free to join the discussion in pull request comments or the issues area if you have questions or suggestions. Thank you for your contribution!

## License
This library is released under the MIT License. See LICENSE for details.