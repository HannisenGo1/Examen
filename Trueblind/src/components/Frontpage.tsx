import logga from '../img/logga.png'

export const Frontpage = () => {
    
    
    return(
        <> 
           <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>

      <div className="DivforRubrik">  
  <h1 className="Rubriktext">
    <span className="firstPart">Find yo</span>
    <span className="secondPart">ur tru</span>
    <span className="firstPart">e match</span>
  </h1>
</div>
       
        <div className="btncontainer"> 
            <button> Logga in </button> 
            <button> Registrera dig </button> 
            </div> 
          <div className="frontpagetextDiv"> 
        <h2 className="welcometexttopage">
        Vi hjälper dig att hitta äkta förbindelser baserat på känslor och gemensamma värderingar, 
        utan att döma utifrån yttre faktorer. 
        Öppna ditt hjärta och låt känslorna leda dig till din sanna match. </h2> </div> 
      <div className="Footer"> 
        
        </div> 
        
        </>
    )
}