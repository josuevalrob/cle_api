export const newGuestRequest = ({firstName, letter, email}) => /*html*/
`
  <b> Hello SuperAdmin! </b>
  <br>
  Hemos recibido un correo por parte de ${doc.firstName} solicitando lo siguiente
  ${doc.letter}.
  <br>
  Hemos creado en tu perfil de administrador el perfil del invitado bajo este correo
  electrónico: ${doc.email}, si consideras puedes acceder a la plataforma en el
  apartado de invitados y completar su perfil para poder enviarle una invtación para la 
  cuenta de Patreon.
`

export const guestApproved = ({id}) => /*html*/
`
  <b> Welcome to the Website LaForja! </b>
  <br>
  <p>
    Click here to activate your account <a href="${id}">Laforja.org</<a>
  </p>
`

export const assignManager = ({id, firstName, email, owner}) => /*html*/
`
  <b> 👋 Hola, qué tal ${owner.firstName}! </b>
  <br>
  Te hemos asignado un nuevo invitado, ${firstName}
  <br>
  <p>Previamente nos envió una carta con la siguiente información:</p>
  <p>${doc.letter}.</p>
  <br>
  <p>
    Ahora te corresponde a ti, hacer un siguimiento de este usuario, y
    si consideras, hacerle una invitación más formal accediendo al
    siguiente enlace:
  </p>
  <br>
  <a href="${process.env.ALLOW_ORIGINS}/CLE/guest/invite/${id}">
    ${firstName}
  </<a>
  <br>
  <p>
    Si necesitas contactarte con ${firstName}, recuerda que aqui tienes su
    email: <a href="${email}">${email}</p>
  </p>
`
//* sending email to the patreon.
export const invToCamping = ({firstName, owner, patreon, turno}) => /*html*/
`
  <b> Congratulations!! </b> 
  <br>
  <p>
    ${owner.firstName} has invited ${firstName} 
    to the turn ${turno.name}. 
  </p>
  <p>
    Now access with you account ${patreon.firstName} / 
    ${patreon.email} and <a href="${patreon.id}">
    compleate the registration process </a>
  </p>  
`