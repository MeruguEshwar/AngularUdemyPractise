import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordStrengthValidator {
  static validateSequence(control: AbstractControl): ValidationErrors | null {
    // Check for sequential numerical characters
    for (var i in control.value) {
      if (
        +control.value[+i + 1] == +control.value[i] + 1 &&
        +control.value[+i + 1] == +control.value[i] + 1
      ) {
        return { validateSequence: true };
      }
    }
    // Check for sequential alphabetical characters
    for (var i in control.value) {
      if (
        String.fromCharCode(control.value.charCodeAt(i) + 1) ==
          control.value[+i + 1] &&
        String.fromCharCode(control.value.charCodeAt(i) + 1) ==
          control.value[+i + 1]
      ) {
        return { validateSequence: true };
      }
    }
    return null;
  }

  static hasRepeatedLetters(control: AbstractControl): ValidationErrors | null {
    var patt = /^([a-zA-Z0-9~!@#$%^&*()+-?])\1+$/;
    if (patt.test(control.value)) {
      return { hasRepeatedLetters: true };
    }
    return null;
  }

  static isMatchPattern(control: AbstractControl): ValidationErrors | null {
    let upperCaseCharacters = /[A-Z]+/g;
    let lowerCaseCharacters = /[a-z]+/g;
    let numberCharacters = /[0-9]+/g;
    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (
      upperCaseCharacters.test(control.value) === false ||
      lowerCaseCharacters.test(control.value) === false ||
      numberCharacters.test(control.value) === false ||
      specialCharacters.test(control.value) === false
    ) {
      return { isMatchPattern: true };
    }
    return null;
  }
}
