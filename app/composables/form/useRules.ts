export function useRules() {
  return {
    requiredString(value: unknown) {
      return (typeof value === 'string' && !!value) || 'Valor obrigatório'
    },

    requiredNumber(value: string | number) {
      return (isValidNumber(value) && value !== undefined) || 'Valor obrigatório'
    },

    numberGreaterThanZero(value: string | number) {
      const numberValue = stringToNumber(value)

      return numberValue > 0 || 'Apenas valores maiores que zero'
    },

    validEmail(value: unknown) {
      const emailRegExp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

      return (typeof value === 'string' && emailRegExp.test(value)) || 'E-mail inválido'
    },

    strongPassword(value: unknown) {
      const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

      return (typeof value === 'string' && passwordRegExp.test(value)) || 'No mínimo 8 caracteres, contendo letras, números e caracteres especiais'
    },

    matchingPasswords(password: unknown, confirmPassword: unknown) {
      return password === confirmPassword || 'As senhas não correspondem'
    },

    validDatetime(value: unknown) {
      const datetimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

      return (typeof value === 'string' && datetimeRegExp.test(value)) || 'Data inválida'
    },
  }
}
