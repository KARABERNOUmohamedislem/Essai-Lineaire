let speed=0;
function sleep(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, speed*delay);
    });
}
//===========================================fleche====================================================
let fleche_right = document.getElementById('fleche-right');

let ctxr = fleche_right.getContext('2d');
ctxr.beginPath();
ctxr.moveTo(5,30);
ctxr.lineTo(35,30);
ctxr.lineTo(30,25);
ctxr.lineTo(35,30);
ctxr.lineTo(30,35);
ctxr.stroke();
//===========================================animation classe==========================================
function animations() {

}
animations.prototype={
    constructor:animations(),
    animenreg:function (nmrEnreg,color,still=false) {
        let a=document.getElementById('case'+(nmrEnreg));
        if (still){
            anime({
                targets: a,
                background:color,
            })
        }else {
            anime({
                targets: a,
                background: [{
                    value: color,
                    duration: 500 * speed,
                }
                    ,
                    {
                        value: '#ffffff',
                        duration: 100 * speed,
                    }
                ]
            })
        }
    },
    animeff:function(nmr,color){
        let a=document.getElementById('caseeff'+(nmr));
        anime({
            targets:a,
            background:[{value:color,
                duration:500*speed,}
                ,
                {
                    value: '#ffffff',
                    duration: 100*speed,
                }
            ]
        })
    },

    anime_border_enreg: function (nmrEnreg,borderColor) {
        anime({
            targets:'case'+(nmrEnreg),
            borderTopColor:borderColor,
        });
    }
};

//============================================essai lineaire classe===================================

function Tcase(cle,eff) {
    this.cle=cle;
    this.eff=eff;
}

Tcase.prototype ={
    constructor:Tcase,
};

function EssaiLineaire(tab,nbmax,doubleHachage=false){
    this.tab=tab;
    this.nbmax=nbmax;
    this.nbrCaseVide=nbmax;
    this.doubleHachage=doubleHachage;
    let container=document.getElementById('Essai lineaire');
    let table=document.createElement('table');
    table.className='table-fill';
    let x;
    if (doubleHachage){
        x='<thead>\n' +
            '            <tr>\n' +
            '                <th class="text-center case">Case</th>\n' +
            '                <th class="text-center donnee">Donnees</th>\n' +
            '                <th class="text-center eff">Eff </th>\n'+
            '            </tr>\n' +
            '        </thead>';
    }
    else {
        x='<thead>\n' +
            '            <tr>\n' +
            '                <th class="text-center case">Case</th>\n' +
            '                <th class="text-center donnee">Donnees</th>\n' +

            '            </tr>\n' +
            '        </thead>';
    }
    table.innerHTML=x;
    let tblock=document.createElement('tbody');
    tblock.className='table-hover';
    for (let k=0;k<nbmax;k++){
        this.tab[k]=new Tcase(undefined,0);
        let tr=document.createElement('tr');
        tr.innerHTML='<td class="text-center">'+k+'</td>'+'<td id="case'+k+'" class="text-center ">Vide</td>';
        if (doubleHachage){tr.innerHTML+='<td id="caseeff'+k+'" class="text-center">0</td>';}
        tblock.appendChild(tr);
    }
    table.appendChild(tblock);
    container.appendChild(table);
    let canvas=document.createElement('canvas');
    canvas.className='fleches';
    canvas.id='fleche-cote';
    let y=38*nbmax;
    canvas.height=y;
    canvas.width=210;
    container.appendChild(canvas);
}
EssaiLineaire.prototype={
  constructor:EssaiLineaire,
  hash: async function (cle,animtion=false) {
      let a = cle % this.nbmax;
      if (animtion) {

      document.getElementById('case-hach1').style.opacity = 0;
      document.getElementById('fleche-right').style.opacity = 0;
      document.getElementById('case-hach2').style.opacity = 0;
      await sleep(600);

      document.getElementById('donne1').innerText = cle;
      document.getElementById('donne2').innerText = a;

      document.getElementById('case-hach1').style.opacity = 1;
      await sleep(500);
      document.getElementById('fleche-right').style.opacity = 1;
      await sleep(500);
      document.getElementById('case-hach2').style.opacity = 1;
      await sleep(500);
  }
        return a;
  },
  hashprim:function(cle){
    let a = this.hash(cle);
    a*=a;
    return a % this.nbmax;
  },
  fillcase:async function(cle,nbrcase,eff=0){
      let ncase=document.getElementById('case'+nbrcase);
      ncase.innerText=cle;
      let efff=document.getElementById('caseeff'+nbrcase);
      efff.innerText=eff;

  },
    resete:async function(){
      let an=new animations();
      for (let k=0;k<this.nbmax;k++){
          an.animenreg(k,'#fff',true);
      }
    },
  recherche:async function (cle) {
      this.resete();
      let a=new animations();
      let canvas=document.getElementById('fleche-cote');
      let ctx=canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
        let trouv=false;
        let adr= await this.hash(cle,true);
        let step;
        if (this.doubleHachage){
            step=this.hashprim(cle);
        }
        else {
            step=1;
        }
        while ((!trouv) && (this.tab[adr].cle != undefined)){
            if ((this.tab[adr].cle==cle) && (this.tab[adr].eff==0)){
                trouv=true;
                a.animenreg(adr,'#43ee06',true);
                await sleep(500);
            }
            else {

                a.animenreg(adr,'#f10b2b');
                await sleep(500);
                ctx.beginPath();
                let begin=38*adr+15;
                ctx.moveTo(2,begin);
                adr-=step;
                if (adr<0){adr=this.nbmax+adr}
                let end=38*adr+15;
                ctx.quadraticCurveTo(20*(Math.abs(end-begin)/38),(begin+end)/2 , 2 , end );

                ctx.stroke();
                await sleep(300);
            }
        }

        if (!trouv){
            a.animenreg(adr,'#f0f80a');
            await sleep(500);
        }
        return [trouv,adr];
  },
  insertion:async function (cle) {
      let an=new animations();
      if (this.nbrCaseVide>=2){
        let a=await this.recherche(cle);
        let trouv=a[0],adr=a[1];
        if (!trouv){

                this.tab[adr].cle=cle;
                this.tab[adr].eff=0;
                an.animenreg(adr,'#f0f80a');
                this.fillcase(cle,adr);
                await sleep(200);
                an.animenreg(adr,'#43ee06');
                await sleep(300);
                this.nbrCaseVide--;

        }
        else {
            console.log('la cle existe deja');
        }
      }
      else {
          console.log('the table is full');
      }
  },
  suppression:async function (cle) {
            let a=await this.recherche(cle);
            let canvas=document.getElementById('fleche-cote');
            let ctx=canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let an=new animations();
            let trouv=a[0],adr=a[1];
            let stop1=false,stop2;
            let j,i;
            if (trouv) {
                if (this.doubleHachage) {
                    this.tab[adr].eff=1;
                    // document.getElementById('case' + adr).style.background = '#f10b2b';
                    an.animenreg(adr, '#f10b2b');
                    await sleep(300);
                    an.animeff(adr, '#f10b2b');
                    await sleep(300);
                    this.fillcase(this.tab[adr].cle, adr,1);
                    await sleep(200);
                    // document.getElementById('case' + adr).style.background = '#fff';
                } else {
                    j = adr;
                    an.animenreg(j, '#f10b2b');
                    await sleep(300);
                    this.tab[j].cle = undefined;
                    this.fillcase('Vide', j);
                    await sleep(200);
                    this.nbrCaseVide++;
                    while (!stop1) {
                        i = j - 1;
                        if (i < 0) {
                            i = this.nbmax + i
                        }
                        stop2 = false;
                        while ((this.tab[i].cle != undefined) && (!stop2)) {
                            let y = this.tab[i].cle;
                            let hash=await this.hash(y);
                            if ((hash < i && i < j) || (i < j && j <= hash || (j <= hash && hash < i))) {
                                document.getElementById('case' + i).style.background = '#f10b2b';
                                await sleep(500);
                                this.tab[j].cle = y;
                                ctx.beginPath();
                                let begin=38*i+15;
                                ctx.moveTo(2,begin);
                                let end=38*j+15;
                                ctx.quadraticCurveTo(20*(Math.abs(end-begin)/38),(begin+end)/2 , 2 , end );
                                ctx.stroke();
                                an.animenreg(j, '#f10b2b');
                                await sleep(200);
                                this.fillcase(y, j);
                                an.animenreg(j, '#43ee06');
                                await sleep(500);
                                this.tab[i].cle = undefined;
                                an.animenreg(i, '#f10b2b');
                                await sleep(300);
                                this.fillcase('Vide', i);
                                await sleep(200);
                                j = i;
                                stop2 = true;
                            } else {
                                an.animenreg(i, '#43ee06');
                                await sleep(500);
                                i -= 1;
                                if (i < 0) {
                                    i = this.nbmax + i
                                }
                            }
                        }
                        if (!stop2) {
                            stop1 = true;
                        }
                    }
                }
            }
            else {
                console.log('cle non trouve');
            }
    }

};


let fich=new EssaiLineaire([],11);
async function as() {

    await fich.insertion(16);
    await fich.insertion(12);
    await fich.insertion(14);
    await fich.insertion(25);
    await fich.insertion(22);
    await fich.insertion(24);
    await fich.insertion(30);
}

let initialiseee=true;
async function insere() {

        if (initialiseee) {

                let a = prompt('Veuillez tapez la cle:');
                await fich.insertion(a);

        } else {
            alert("Le fichier n'est pas initialise");
        }

}
async function rech() {
    if (initialiseee){
        let a=prompt('Veuillez tapez la cle a rechercher:');
       await fich.recherche(a);
    }
    else {
        alert("Le fichier n'est pas initialise");
    }
}
async function supp() {
    if (initialiseee){
        let s=prompt("Veuillez tapez l'enregitrement a supprimer:");

        await fich.suppression(s);
    }
    else {
        alert("Le fichier n'est pas initialise");
    }

}
// async function initialisation(){
//     let tab=[];
//     let initialise=0;
//     let nbrelemntAinserer=prompt('entrez le nombre de donnees a ')
//     while (initialise<nbrelemntAinserer){
//         let enreg=prompt('entrez l enregistrement '+(initialise+1));
//         tab[initialise]=enreg;
//         initialise++;
//     }
//     initialise=0;
//     this.alloc_bloc();
//     this.aff_entete(1,0);
//     while (initialise<nbrelemntAinserer){
//         let enreg=tab[initialise];
//         await this.insertion(initialise+1,enreg);
//         initialise++;
//     }
//
// }

function getspeed(){
    speed=(document.getElementById('speed').value)/100;
    requestAnimationFrame(getspeed);
}

getspeed();
as();
document.getElementById('inserer').onclick=insere;
document.getElementById('rechercher').onclick=rech;
document.getElementById('supprimer').onclick=supp;





