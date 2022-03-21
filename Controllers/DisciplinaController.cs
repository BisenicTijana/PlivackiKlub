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
    public class DisciplinaController : ControllerBase
    {
        public PlivackiKlubContext Context { get; set; }
        public DisciplinaController(PlivackiKlubContext context)
        {
            Context = context;
        }

        [Route("PreuzmiDiscipline")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiDiscipline() //ok
        {
            try
            {
                if(Context.Discipline.Count()==0)
                {
                    return BadRequest("Ne postoji ni jedna disciplina!");
                }
                return Ok(await Context.Discipline.Select(p =>
                new
                {
                    ID = p.ID,
                    Stil = p.Stil,
                    Distanca=p.Distanca
                }).ToListAsync());
             
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }

}