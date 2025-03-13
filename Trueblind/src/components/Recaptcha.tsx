import ReCAPTCHA from "react-google-recaptcha";

const publickey = {
  publicRe: import.meta.env.VITE_PUBLIC_RE
};

type verifryre ={
    onVerify: () => void;
}

const YourRechaptcha = ({onVerify}: verifryre) => {

    const handleChange = (value: string | null) => {
        if (value) {
          onVerify();
        }
      };
  return (
    <div className="for-rechapta">
      <ReCAPTCHA
        sitekey={publickey.publicRe}
        onChange={handleChange}
      />
    </div>
  );
};

export default YourRechaptcha
