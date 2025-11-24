
////DATOS
//actividades
const activities = [
  {
    id: "yoga",
    name: "Yoga Suave",
    duration: 60,
    intensity: "Baja",
    photo: "https://www.webconsultas.com/sites/default/files/styles/wch_image_schema/public/media/0d/temas/yoga.jpg",
  },
  {
    id: "spinning",
    name: "Spinning Intensivo",
    duration: 45,
    intensity: "Alta",
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVVl5HJgLoKahN-xu4nP0yhDamh_mHgk21YA&s",
  },
  {
    id: "crossfit",
    name: "CrossFit Funcional",
    duration: 50,
    intensity: "Alta",
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVpdTPoYBgbWYtn8JYSm0Pt-ikKyY30LFn5A&s",
  },
  {
    id: "pilates",
    name: "Pilates Máquinas",
    duration: 55,
    intensity: "Media",
    photo: "https://images.ctfassets.net/ipjoepkmtnha/5nTW9GvNYKtjJukcotDgji/c9cffb3fb04dfe4e7407153f371054dd/TG_REFORM_TechnoGym_Classe_-_12_1198_ADV__1_.jpg",
  },
  {
    id: "zumba",
    name: "Zumba Fitness",
    duration: 40,
    intensity: "Media",
    photo: "https://static.vecteezy.com/system/resources/thumbnails/000/126/255/small/free-zumba-dancers-vector.jpg",
  },
];

//Estructura para almacenar reservas por franja


const reservations = {
  "09:00": [],
  "11:00": [],
  "13:00": [],
  "17:00": [],
  "19:00": [],
};

//Franjas horarias disponibles



const timeSlots = ["09:00", "11:00", "13:00", "17:00", "19:00"];

////VARIABLES DEL DOCUMENTO

const body = document.querySelector("body") ///Para delegacion de servicios (alomejor mas adelante)

const tablaCuerpo = document.getElementById("activitiesTbody")  //tbody de la tabla del menu izquierdo

const btnOcultarIzq = document.querySelector(".btn-toggle")  ///Boton que muestra o esconde el menu de la izquierda

const menuIzq = document.querySelector(".left") //Menu izquierdo

const selectAct = document.querySelector("#selectActivity") //Select de actividades
const selectHoras = document.querySelector("#selectSlot") //Select de hora
const selectPersonas = document.querySelector("#selectPeople") //Select de personas

const btnSubmit = document.querySelector("#btnRegister") //Formulario

const container = document.querySelector(".slots") //Donde van las cards

const modal = document.querySelector("#modal") //Modal



renderApp()

///Funcion que renderiza todo lo que tiene la app
function renderApp(){
  renderActividades()
  renderOptions()
  renderHoras()
  renderCards()
}


///Tabla de actividades

function renderActividades(){

  let tablaActividades = ""

  activities.forEach(act => {
    tablaActividades += `
    <tr>
      <th>${act.name}</th>
      <th>${act.duration}</th>
      <th>${act.intensity}</th>
      <th><img src="${act.photo}" alt="Imagen de la actividad ${act.name}"></th>
    </tr>
    `
  });
  tablaCuerpo.innerHTML= tablaActividades
}

///Boton izquierda mostrar/ocultar
btnOcultarIzq.addEventListener("click", ()=>{

  if(menuIzq.classList.contains("oculto")){
    menuIzq.classList.remove("oculto")
    btnOcultarIzq.innerHTML = "Ocultar Lista de Actividades"
  }else{
    menuIzq.classList.add("oculto")
    btnOcultarIzq.innerHTML = "Mostrar Lista de Actividades"
  }
})

///OPCIONES DEL SELECT

//Actividades

function renderOptions(){
  let opciones =""
  activities.forEach(act => {
    opciones += `
    <option value="${act.name}">${act.name}</option>
    `
  });
  selectAct.innerHTML = opciones
}
//Horas

function renderHoras(){
  let opciones =""
  timeSlots.forEach(time => {
    opciones += `
    <option value="${time}">${time}</option>
    `
  });
  selectHoras.innerHTML = opciones
}

///SUBMIT DEL FORMULARIO

btnSubmit.addEventListener("click",  ()=>{
  
  let registro = {
    act : selectAct.value, 
    pers : selectPersonas.value,
    hor : selectHoras.value
  }
//////////////////////////////////////

  timeSlots.forEach(time => {
    if(selectHoras.value == time){
      reservations[time].push(registro)
    }
  });

  renderCards()
})

//Renderzar las cards que se muestran en el main de la app

function renderCards(){
  let content =""
  timeSlots.forEach(card => {
    let registros =''
    reservations[card].forEach(registro => {
      registros += `
      <div class="reservation-item">
        <p class=".badge-count">
        ${registro.act}, x${registro.pers} ${(registro.pers==1) ? "persona": "personas"}
        </p>
      </div>
      `
    });
    content += `
    <div class="slot" id="${card}">
    <h1 class="time">${card}</h1>
      <div class="reservation-list">
        ${registros}  
      </div>
    </div>`
  });
  container.innerHTML = content
}


//modal ---Mostrar el modal

container.addEventListener("click", (e)=>{
  
  if(e.target.classList.contains("slot")){
    modal.classList.add("show")
  }

  document.querySelector("#modalTitle").innerHTML = `Detalles de reservas para las ${e.target.id}`

  ///Mostrar tabla con las reservas

  const contentTablaModal = document.querySelector(".contentModal")
  let rows = ""
  let totalMin = ""
  if(reservations[e.target.id] != ""){
    reservations[e.target.id].forEach(reservas => {
    let duracion =""
    
    activities.forEach(act => {
      if(act.name == reservas.act){
        duracion = act.duration
      }
    })
      rows += `    
        <tr>
          <td>${reservas.act}</td>
          <td>${reservas.pers}</td>
          <td>${duracion} min</td>
          <td>${reservas.pers * duracion} min</td>
        </tr>
      `
      totalMin = parseInt(totalMin + (reservas.pers * duracion))
    });


    /////TOTAL DE MINUTOS (CARGA)
    rows += `    
        <tr>
          <td colspan="2">TOTAL DE MINUTOS</td>
          <td colspan="2">${totalMin} min</td>
        </tr>
      `

    contentTablaModal.innerHTML = rows
  }else{
    contentTablaModal.innerHTML = `
     <tr>
      <td colspan="4">No hay reservas todavia a esta hora</td>   
      </tr>`
  }
})
//Cerrar el modal
modal.addEventListener("click", (e) =>{
    if(e.target.classList.contains("close-btn")){
      modal.classList.remove("show")
    }
})


