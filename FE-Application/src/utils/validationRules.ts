import type { Rule } from "antd/es/form";

/** Regex số điện thoại VN: 9–11 chữ số */
export const PHONE_PATTERN = /^[0-9]{9,11}$/;

export const emailRules = (
  requiredMessage: string,
  invalidMessage: string,
): Rule[] => [
  { required: true, message: requiredMessage },
  { type: "email", message: invalidMessage },
];

export const passwordMinRules = (
  requiredMessage: string,
  minMessage: string,
  minLength: number = 6,
): Rule[] => [
  { required: true, message: requiredMessage },
  { min: minLength, message: minMessage },
];

export const phoneRules = (
  invalidMessage: string,
  options?: { required?: boolean; requiredMessage?: string },
): Rule[] => {
  const rules: Rule[] = [];
  if (options?.required) {
    rules.push({
      required: true,
      message: options.requiredMessage || invalidMessage,
    });
  }
  rules.push({ pattern: PHONE_PATTERN, message: invalidMessage });
  return rules;
};
