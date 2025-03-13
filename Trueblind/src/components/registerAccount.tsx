import React, {  useState } from 'react';
import logga from '../img/logga.png'
import { useNavigate } from 'react-router-dom'; 
import {validateFormData, intresseLista} from '../validering'
import { FormData } from '../interface/interfaceUser';
import { Anvandarpolicy } from './UseInfo';
import { doSendEmailVerification, doSignUpWithEmailAndPassword } from './data/UserAuth';
import ReCAPTCHA from "react-google-recaptcha"

export const Register = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName:'',
        age: { 
            month: '', 
            day: '', 
            year: '' },
        city: '',
        gender: '',
        sexualOrientation: '',
        religion: '',
        interests: [] as string[],
        hasChildren: false,
        wantsChildren: false,
        smokes: '',
        relationshipStatus: '',
        education: '',
        favoriteSong: '',
        favoriteMovie: '',
        email: '',
        lifeStatement1: '',
        lifeStatement2:'',
        password:'',
        credits: 0, 
        purchasedEmojis: [],
        vipStatus: false, 
        vipExpiry: null, 
        vipPlusStatus: false,
        vipPlusExpiry: null,
        hasUsedPromoCode: false,

    });
    
    
    const handleInterestClick = (interest: string) => {
        setFormData((prev: FormData) => {
            const newInterests = [...prev.interests];
            const index = newInterests.indexOf(interest);
    
            if (index > -1) {

                newInterests.splice(index, 1);
            } else if (newInterests.length < 5) {
                newInterests.push(interest);
            }
    
            const updatedData = { ...prev, interests: newInterests };
    
            const errors = validateFormData(step, updatedData); 
            setErrors(errors); 
    
            return updatedData;
        });
    };
    
    type Errors = {
        [key: string]: string; 
      };
      const [errors, setErrors] = useState<Errors>({});

    const [errors2, setErrors2] = useState<any>({}); 
    const [step, setStep] = useState(1);
    const [isRegistered, setIsRegistered] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(true);
    const [isTermsVisible, setIsTermsVisible] = useState(false);
    const [isReClicked, setIsReClicked] = useState(false)
    const [filteredErrors, setFilteredErrors] = useState<[string, string][]>([]);

  
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
    
        let newValue = value;
    
     
        if (name === 'email') {
            newValue = value.toLowerCase();
        }
    
        setFormData((prevData) => {

            let updatedData = { ...prevData };
            if (['month', 'day', 'year'].includes(name)) {
                updatedData = {
                    ...prevData,
                    age: {
                        ...prevData.age,
                        [name]: newValue,
                    },
                };
            } else if (type === 'checkbox') {
    
                const checked = (e.target as HTMLInputElement).checked;
                updatedData = {
                    ...prevData,
                    [name]: checked,
                };
            } else if (type === 'select-multiple') {

                const options = (e.target as HTMLSelectElement).selectedOptions;
                const values = Array.from(options).map((option) => option.value);
                updatedData = {
                    ...prevData,
                    [name]: values,
                };
            } else {
                updatedData = {
                    ...prevData,
                    [name]: newValue,
                };
            }
            const errors = validateFormData(step, updatedData);
            setErrors(errors);
    
            return updatedData;
        });
    };
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreedToTerms(e.target.checked);
    };
    
    
    const onChangeRe = (value: string | null) => {
        setIsReClicked(!!value);
      };
    const handleShowTerms = () => {
        setIsTermsVisible(true);  
    };
      
    {/* 
    const handleAcceptTerms = () => {
        setAgreedToTerms(true);  
        setIsTermsVisible(false); 
    };
    
    const handleCloseTerms = () => {
        setIsTermsVisible(false); 
    };       */ }

    const goBackToHome = () => {
        navigate('/');
    };
    
    const handleNext = () => {

        const validationErrors = validateFormData(step, formData);
        
        const stepFields: Record<number, string[]> = {
          1: ['firstName', 'lastName', 'password', 'age', 'city', 'email'],
          2: ['gender', 'sexualOrientation'],
          3: ['religion', 'interests'],
          4: ['hasChildren', 'smokes'],
          5: ['relationshipStatus', 'education'],
          6: ['favoriteSong', 'favoriteMovie', 'lifeStatement1', 'lifeStatement2'],
        };
        
        const filteredErrors = Object.entries(validationErrors).filter(([key]) =>
          stepFields[step]?.includes(key)
        );
    
        if (filteredErrors.length > 0) {
            setErrors(validationErrors);
            setFilteredErrors(filteredErrors);
        } else {
            setFilteredErrors([]);
            setStep(step + 1);  

        }
    };

    const handlePrevious = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };
    
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!(isReClicked && Object.keys(errors).length === 0)) {
            return; 
        }
    
        try {
            const success = await doSignUpWithEmailAndPassword(formData);
            if (success) {
                setIsRegistered(true);
                await doSendEmailVerification();
            } else {
                setErrors2('Registrerad!');
            }
        } catch (error) {
            console.error('Fel vid registrering:', error);
            setErrors2('Ett fel uppstod vid registrering.');
        }
    };

    return (
        <>
        <div className="logga">
        <img src={logga} alt="picture" className="img" onClick={goBackToHome}/>
        </div>
        <div>
        
        </div> 
        <div className="DivforRubrik">  
        <h1 className="Rubriktext">
        <span className="firstPart">Regis</span>
        <span className="secondPart">trera di</span>
        <span className="firstPart">g här</span>
        </h1>
        </div>
        

        <form onSubmit={handleSubmit}>
        
        {step === 1 && (
            <>
            <label htmlFor="email">E-post * </label>
            <input type="email" 
            id="email" 
            aria-label="E-postadress" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            placeholder="Skriv din e-post" 
            />
            {errors.email && <p className="error">{errors.email}</p>}
          



            <label htmlFor="password">Lösenord *</label>
            <input type="password" id="password" name="password" value={formData.password}
            onChange={handleChange} aria-label="lösenord"  placeholder="Skriv in lösenord" />
            <p className="ptext"> Minst 8 tecken långt,En stor bokstav och ett tecken</p>
            {errors.password && <span className="error">{errors.password}</span>}
            
            <label htmlFor="firstName">Förnamn *</label>
            <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
           
            <label htmlFor="lastName">Efternamn *</label>
            <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
            
            <label htmlFor="month">Månad *</label>
<input
  type="number"
  id="month"
  name="month"
  value={formData.age.month}
  onChange={handleChange}
  min="1"
  max="12"
  placeholder="Välj månad"
/>
{errors.age && <span className="error">{errors.age}</span>}
<label htmlFor="day">Dag *</label>
<input
  type="number"
  id="day"
  name="day"
  value={formData.age.day}
  onChange={handleChange}
  min="1"
  max="31"
  placeholder="Välj dag"
/>

<label htmlFor="year">År *</label>
<input
  type="number"
  id="year"
  name="year"
  value={formData.age.year}
  onChange={handleChange}
  min="1945"
  max="2025"
  placeholder="Skriv in år (4 siffror)"
/>
            
            <label htmlFor="city">Stad *</label>
            <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            />
            {errors.city && <span className="error">{errors.city}</span>}
            </>
            
        )}
{filteredErrors.map(([key, value]) => (
  <p key={key} style={{ color: 'red', fontSize: '16px' }}>
    {value}
  </p>
))}

        {step === 2 && (
            <>
            <label htmlFor="gender">Kön * </label>
            <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}>
            <option value="">Välj kön</option>
            <option value="Man">Man</option>
            <option value="Kvinna">Kvinna</option>
            
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
            
            <label htmlFor="sexualOrientation">Sexuell läggning *</label>
            <select
            id="sexualOrientation"
            name="sexualOrientation"
            value={formData.sexualOrientation}
            onChange={handleChange}
            >
            <option value="">Välj sexuell läggning *</option>
            <option value="Hetero">Hetero</option>
            <option value="Homo">Homo</option>
            <option value="Bi">Bisexuell</option>
            <option value="other">Annat</option>
            </select>
            {errors.sexualOrientation && <span className="error">{errors.sexualOrientation}</span>}
            </>
        )}
        
        {step === 3 && (
            <>
            <label htmlFor="religion">Religion *</label>
            <select
            id="religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            >
            <option value="">Välj religion</option>
            <option value="Kristen">Kristen</option>
            <option value="Islam">Muslim</option>
            <option value="Jude">Jude</option>
            <option value="Hinduism">Hindu</option>
            <option value="Annat">Annat</option>
            <option value="Ingen">Ingen</option>
            </select>
            {errors.religion && <span className="error"> </span>}

            <label htmlFor="interests">Välj 5 intressen: * </label>
            <div className="interest-buttons">
            {intresseLista.map((interest) => (
                <button
                type="button"
                key={interest}
                className={`interest-button ${formData.interests.includes(interest.toLowerCase()) ? 'selected' : ''}`}
                onClick={() => handleInterestClick(interest.toLowerCase())}
                disabled={formData.interests.length >= 5 && !formData.interests.includes(interest.toLowerCase())}
                
                >
                {interest}
                </button>
            ))}

            </div>
            {errors.interests && <span className="error">{errors.interests}</span>}
            </>
        )}
        
        {step === 4 && (
            <>
            <label htmlFor="hasChildren">
            Har du barn?
            <input
            type="checkbox"
            id="hasChildren"
            name="hasChildren"
            checked={formData.hasChildren}
            onChange={handleChange}
            />
            </label>
            {errors.hasChildren && <span className="error">{errors.hasChildren}</span>}
            
            <label htmlFor="wantsChildren">
            Vill du ha barn?
            <input
            type="checkbox"
            id="wantsChildren"
            name="wantsChildren"
            checked={formData.wantsChildren}
            onChange={handleChange}
            />
            </label>
            {errors.wantsChildren && <span className="error">{errors.wantsChildren}</span>}
            <label htmlFor="smokes">Röker du?</label>
            <div>
            <label>
            <input
            type="radio"
            id="smokes_no"
            name="smokes"
            value="nej"
            checked={formData.smokes === 'nej'}
            onChange={handleChange}
            />
            Nej
            </label>
            <label>
            <input
            type="radio"
            id="smokes_yes"
            name="smokes"
            value="ja"
            checked={formData.smokes === 'ja'}
            onChange={handleChange}
            />
            Ja
            </label>
            <label>
            <input
            type="radio"
            id="smokes_occasional"
            name="smokes"
            value="feströker"
            checked={formData.smokes === 'feströker'}
            onChange={handleChange}
            />
            Ibland
            </label>
            </div>
            {errors.smokes && <span className="error">{errors.smokes}</span>}
            </>
        )}
        
        {step === 5 && (
            <>
            <label htmlFor="relationshipStatus">Vad söker du? *</label>
            <select
            id="relationshipStatus"
            name="relationshipStatus"
            value={formData.relationshipStatus}
            onChange={handleChange}
            >
            <option value="">Välj vad du söker:</option>
            <option value="Seriöst">Seriöst förhållande</option>
            <option value="Öppet">Öppen för seriöst</option>
            <option value="Vänner">Nya vänner</option>
            
            </select>
            {errors.relationshipStatus && <span className="error">{errors.relationshipStatus}</span>}
            <label htmlFor="education">Utbildningsnivå</label>
            <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            >
            <option value="">Välj utbildning *</option>
            <option value="Grundskola">Grundskola</option>
            <option value="Gymnasium">Gymnasium</option>
            <option value="Universitet">Universitet</option>
            <option value="Kandidatexamen"> kandidatexamen </option>
            </select>
            {errors.education && <span className="error">{errors.education}</span>}
            </>
        )}
        
        {step === 6 && (
            <>
            
            <label htmlFor="favoriteSong">Favorit låt: *</label>
            <input
            type="text"
            id="favoriteSong"
            name="favoriteSong"
            value={formData.favoriteSong || ''}
            onChange={handleChange}
            />
            
            <label htmlFor="favoriteMovie">Favorit film: *</label>
            <input
            type="text"
            id="favoriteMovie"
            name="favoriteMovie"
            value={formData.favoriteMovie || ''}
            onChange={handleChange}
            />
            <p> Avsluta meningen * </p>
            <label>Jag skulle aldrig kunna leva utan...</label>
            <input
            type="text"
            name="lifeStatement1"
            value={formData.lifeStatement1}
            onChange={handleChange}
            />
            
            <label>Jag blir mest inspirerad när...</label>
            <input
            type="text"
            name="lifeStatement2"
            value={formData.lifeStatement2}
            onChange={handleChange}
            />
            
             {/* 
            <div className="register-terms-checkbox">
        
            <label htmlFor="agreeTerms">
            Jag godkänner * {' '}
            <a href="#" onClick={handleShowTerms}>
            användarvillkoren 
            </a>
            </label>    <input
            type="checkbox"
            id="agreeTerms"
            checked={agreedToTerms}
            onChange={(e) => setFormData({
                ...formData,
                agreeTerms: e.target.checked  // Här uppdateras agreeTerms korrekt
              })}
            />
            </div>
*/ }  


               
            <div className="for-rechapta"> 
        <ReCAPTCHA
    sitekey="6Le2GPMqAAAAAAzKGmzp0K8kbsG_C_kJUb8nBfXs"
    onChange={onChangeRe} />
</div>
     </>
        )}
        
        <div className="buttoncontainerinRegister">
        {step > 1 && <button className="accountBtn2" aria-label="Gå tillbaka" onClick={handlePrevious}> <i className="fas fa-arrow-left"></i></button>}
        {step < 7 && <button className="accountBtn" aria-label="Nästa steg" onClick={handleNext}>Nästa</button>}

        </div>
        {step === 7 && (
                <div className="step7">
                    <div className="buttoncontainerinRegister">
                        
                        <button 
  className="accountBtn" 
  type="submit" 
  disabled={!( isReClicked && Object.keys(errors).length === 0)}>
  Registrera
</button>
                    </div>
                </div>
            )}
        {isRegistered && (
            <div className="confirmation-message">
                 <div className="confirmation-message">
            <h2>Du har blivit registrerad!</h2>

            </div>
            <p>Välkommen till Trublind! Verifiering mejl har skickats till din e-post, verifiera dig innan du kan komma in</p>
            <button className="accountBtn" onClick={goBackToHome}>Till startsidan</button>
            </div>
        )}
        </form> 
        {/* {isTermsVisible && (
            <Anvandarpolicy
            onClose={handleCloseTerms}
            onAccept={handleAcceptTerms}
            />
        )}  */ } 
        </>
    );
};

