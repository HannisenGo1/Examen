import React, { useState } from 'react';
import logga from '../img/logga.png'
import { useNavigate } from 'react-router-dom'; 
import {validateFormData, intresseLista} from '../validering'

type FormData = {
    firstName: string;
    age: string;
    city: string;
    gender: string;
    sexualOrientation: string;
    religion: string;
    interests: string[];
    hasChildren: boolean;
    wantsChildren: boolean;
    smokes: string;
    relationshipStatus: string;
    education: string;
    photo: File | null;
    favoriteSong: string | '';
    favoriteMovie: string |'';
    email: string;
    lifeStatement1: string;
    lifeStatement2:string;
};

export const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        age: '',
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
        photo: null,
        favoriteSong: '',
        favoriteMovie: '',
        email: '',
        lifeStatement1: '',
        lifeStatement2:''
    });
    
  
    const handleInterestClick = (interest: string) => {
        setFormData((prev: FormData) => {
            const newInterests = [...prev.interests];
            const index = newInterests.indexOf(interest);
            if (index > -1) {
                newInterests.splice(index, 1);  
            } 
            else if (newInterests.length < 5) {
                newInterests.push(interest);
            }
            
            return { ...prev, interests: newInterests };
        });
    };
    
    const [errors, setErrors] = useState<any>({}); 
    const [step, setStep] = useState(1);
    const [isRegistered, setIsRegistered] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else if (type === 'select-multiple') {
            const options = (e.target as HTMLSelectElement).selectedOptions;
            const values = Array.from(options).map((option) => option.value);
            setFormData((prev) => ({
                ...prev,
                [name]: values,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    
    const handleNext = () => {
        const validationErrors = validateFormData(step, formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; 
        }
        setErrors({}); 
        setStep((prev) => prev + 1);  
    };
    
    const handlePrevious = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateFormData(6, formData);  
 
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; 
        }
    
        console.log(formData);
        setIsRegistered(true);
    };
    
    const goBackToHome = () => {
        navigate('/');
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

        {isRegistered && (
        <div className="confirmation-message">
          <h2>Du har registrerat dig!</h2>
          <button className="allowedTohomebtn"onClick={goBackToHome}>Till startsidan</button>
        </div>
      )}
        <form onSubmit={handleSubmit}>
        
        {step === 1 && (
            <>
       <label htmlFor="email">E-post</label>
         <input type="email" id="email"
          name="email" value={formData.email}
          onChange={handleChange} placeholder="Skriv din e-post" />
           {errors.email && <span className="error">{errors.email}</span>}


            <label htmlFor="firstName">Förnamn</label>
            <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
            
            <label htmlFor="age">Ålder</label>
            <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            />
            {errors.age && <span className="error">{errors.age}</span>}
            
            <label htmlFor="city">Stad</label>
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
        
        {step === 2 && (
            <>
            <label htmlFor="gender">Kön</label>
            <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}>
            <option value="">Välj kön</option>
            <option value="male">Man</option>
            <option value="female">Kvinna</option>
            <option value="other">Annat</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
            
            <label htmlFor="sexualOrientation">Sexuell läggning</label>
            <select
            id="sexualOrientation"
            name="sexualOrientation"
            value={formData.sexualOrientation}
            onChange={handleChange}
            >
            <option value="">Välj sexuell läggning</option>
            <option value="hetero">Hetero</option>
            <option value="homo">Homo</option>
            <option value="bi">Bi</option>
            <option value="other">Annat</option>
            </select>
            {errors.sexualOrientation && <span className="error">{errors.sexualOrientation}</span>}
            </>
        )}
        
        {step === 3 && (
            <>
            <label htmlFor="religion">Religion</label>
            <select
            id="religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            >
            <option value="">Välj religion</option>
            <option value="christianity">Kristen</option>
            <option value="islam">Muslim</option>
            <option value="jude">Jude</option>
            <option value="hinduism">Hindu</option>
            <option value="other">Annat</option>
            <option value="nothing">Ingen</option>
            </select>
            {errors.religion && <span className="error">{errors.religion}</span>}
            <label htmlFor="interests">Välj 5 intressen:</label>
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
            Feströker
            </label>
            </div>
            {errors.smokes && <span className="error">{errors.smokes}</span>}
            </>
        )}
        
        {step === 5 && (
            <>
            <label htmlFor="relationshipStatus">Vad söker du?</label>
            <select
            id="relationshipStatus"
            name="relationshipStatus"
            value={formData.relationshipStatus}
            onChange={handleChange}
            >
            <option value="">Välj</option>
            <option value="serious">Seriöst förhållande</option>
            <option value="casual">Öppen för seriöst</option>
            <option value="friends">Nya vänner</option>
            </select>
            {errors.relationshipStatus && <span className="error">{errors.relationshipStatus}</span>}
            <label htmlFor="education">Utbildningsnivå</label>
            <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            >
            <option value="">Välj utbildning</option>
            <option value="primary">Grundskola</option>
            <option value="highschool">Gymnasium</option>
            <option value="university">Universitet</option>
            <option value="bachelor"> kandidatexamen </option>
            </select>
            {errors.education && <span className="error">{errors.education}</span>}
            </>
        )}
        
        {step === 6 && (
            <>
            <label htmlFor="photo">
            Ladda upp en bild på dig
            <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            />
            </label>
            {/* Favorit Låt*/}
            <label htmlFor="favoriteSong">Favorit låt:</label>
            <input
            type="text"
            id="favoriteSong"
            name="favoriteSong"
            value={formData.favoriteSong || ''}
            onChange={handleChange}
            />
            
            {/* Favorit Film */}
            <label htmlFor="favoriteMovie">Favorit film:</label>
            <input
            type="text"
            id="favoriteMovie"
            name="favoriteMovie"
            value={formData.favoriteMovie || ''}
            onChange={handleChange}
            />
            <p> Avsluta meningen </p>
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
            </>
        )}
        
        
        <div className="buttoncontainerinRegister">
        {step > 1 && <button className="buttonbk" onClick={handlePrevious}>Tillbaka</button>}
        {step < 6 && <button className="buttonnext" onClick={handleNext}>Nästa</button>}
        {step === 6 && <button className="buttonnext" type="submit">Registrera</button>}
        </div>
        
        </form> 

        </>
    );
};
export default FormData
