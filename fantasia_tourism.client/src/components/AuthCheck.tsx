import React, { useState, cloneElement, ReactElement } from 'react';
import { useUser } from "@/contexts/UserContext";
import SignInModal from './SignInModal';
import RegisterModal from './RegisterModal';

interface AuthCheckProps {
  children: ReactElement;
  fallbackAction?: () => void;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children, fallbackAction }) => {
  const { user } = useUser();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleClick = () => {
    if (user) {
      // User is authenticated, proceed with original action
      if (children.props.onClick) {
        children.props.onClick();
      }
    } else {
      // User is not authenticated, show sign in modal or custom fallback
      if (fallbackAction) {
        fallbackAction();
      } else {
        setShowSignInModal(true);
      }
    }
  };

  return (
    <>
      {cloneElement(children, {
        onClick: handleClick,
      })}
      
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToRegister={() => {
          setShowSignInModal(false);
          setShowRegisterModal(true);
        }}
      />
      
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToSignIn={() => {
          setShowRegisterModal(false);
          setShowSignInModal(true);
        }}
      />
    </>
  );
};

export default AuthCheck;