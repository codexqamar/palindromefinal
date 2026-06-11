// utils/authErrors.ts
export const getFriendlyErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'wrong_email': 'We could not find an account with that email address.',
    'wrong_password': 'The password you entered is incorrect.',
    'invalid_credentials': 'The email or password you entered is incorrect.',
    'email_not_confirmed': 'Please verify your email before signing in.',
    'user_already_exists': 'An account already exists with this email.',
    'weak_password': 'Password is too weak. Please use a stronger password.',
    'over_email_send_rate_limit': 'Too many emails sent. Please try again later.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
