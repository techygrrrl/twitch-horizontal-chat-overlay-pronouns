export const kebabify = (input: string): string => {
  return input.toLowerCase().replace(/\W/, '-')
}