using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace PROJEKAT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TakmicenjeController : ControllerBase
    {
        public PlivackiKlubContext Context { get; set; }
        public TakmicenjeController(PlivackiKlubContext context)
        {
            Context = context;
        }


        [Route("DodajTakmicenje/{rang}/{vel}/{grad}/{drzava}/{datum}")]
        [HttpPost]
        public async Task<ActionResult> DodajTakmicenje(string rang,int vel,string grad, string drzava, DateTime datum)//ok
        {

            if((string.IsNullOrWhiteSpace(rang) || rang.Length>50) || (rang!="miting" && rang!="drzavno" && rang!="medjunarodno"))//dodaj proveru
            {
                return BadRequest("Pogresan Rang!");
            }

            if(string.IsNullOrWhiteSpace(grad) || grad.Length>50)
            {
                return BadRequest("Pogresan grad!");
            }

            if(string.IsNullOrWhiteSpace(drzava) || drzava.Length>50)
            {
                return BadRequest("Pogresna drzava!");
            }
            if(vel!=25 && vel!=50)
            {
                return BadRequest("Pogresna velicina bazena!");
            }

            try
            {
                rang=rang.ToLower();
                grad=grad.ToLower();
                drzava=drzava.ToLower();
                
                var imaTakm=Context.Takmicenja.Where(p=>p.Grad==grad && p.Drzava==drzava
                                && p.Datum==datum && p.Rang==rang && p.VelicinaBazena==vel).FirstOrDefault();
                
                
                if(imaTakm != null)
                {
                   return BadRequest("Takmicenje vec postoji u bazi!");
                }
                
                    var takm=new Takmicenje();
                    takm.Rang=rang;
                    takm.Datum=datum;
                    takm.Drzava=drzava;
                    takm.VelicinaBazena=vel;
                    takm.Grad=grad;

                    Context.Takmicenja.Add(takm);
                    
                  
                await Context.SaveChangesAsync();
                return Ok(takm);
              
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
       
        [Route("NadjiTakmicenje")]
        [HttpGet]
        public async Task<ActionResult> NadjiTakmicenje(DateTime? dat=null, string grad=null)//ok
        {
            
            if(dat==null && grad==null)
            {
                return BadRequest("Morate uneti datum ili grad za pretragu!");
            }
          
            try
           {
               if(grad!=null)
               {
                   grad=grad.ToLower();
               }
               var takm=Context.Takmicenja.Where(p=> ( dat!=null ? p.Datum==dat : true) && ( grad!=null ? p.Grad==grad : true));

                //VALIDACIJE
                if(dat!=null && grad!=null && takm.Count()==0)
                {
                    //unet datum i grad , ali nema takm 
                    return BadRequest("Ne postoji takmicenje koje se odrzalo "+ dat.Value.ToShortDateString()+" u gradu "+grad);
                }
                if(dat!=null && takm.Count()==0)//unet datum, nije grad, ali nema takm
                {
                    return BadRequest("Ne postoji takmicenje koje se odrzalo "+ dat.Value.ToShortDateString());
                }
                if(grad!=null && takm.Count()==0)//unet grad, datum ne, nema takm u tom gradu
                {
                    return BadRequest("Ne postoji takmicenje koje se odrzalo u gradu "+grad);
                }

               return Ok(await takm.ToListAsync());
               
           
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    
       [Route("PromeniTakmicenje/{id}/{rang}/{vel}")]
       [HttpPut]

       public async Task<ActionResult> PromeniTakmicenje(int id, string rang,int vel)//ok
       {
           if((string.IsNullOrWhiteSpace(rang) || rang.Length>50) || (rang!="miting" && rang!="drzavno" && rang!="medjunarodno"))
            {
                return BadRequest("Pogresan Rang!");
            }
            if(id<0)
            {
                return BadRequest("Nevalidan id!");
            }
            if(vel!=25 && vel!=50)
            {
                return BadRequest("Pogresna velicina bazena!");
            }

            try
            {
                rang=rang.ToLower();
                var takm=Context.Takmicenja.Where(p=>p.ID==id).FirstOrDefault();
                if(takm==null)
                {
                    return BadRequest("Ne postoji ovo takmicenje!");
                }
                var imaTakm= Context.Takmicenja.Where(p=>p.Grad==takm.Grad && p.Drzava==takm.Drzava
                                && p.Datum==takm.Datum && p.Rang==rang && p.VelicinaBazena==vel).FirstOrDefault();
                if(imaTakm!=null)
                {
                    return BadRequest("Vec postoji takmicenje sa ovim karakteristikama!");
                }
                takm.Rang=rang;
                takm.VelicinaBazena=vel;

                await Context.SaveChangesAsync();

                return Ok(takm);
            }
           catch(Exception e)
            {
                return BadRequest(e.Message);
            }
       }
           

//-------------------------NE KORISTIM----------------------------//


        [Route("PreuzmiTakmicenja")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiTakmicenja()
        {
            return Ok(await Context.Takmicenja.ToListAsync());
        }

       
      
    }
}