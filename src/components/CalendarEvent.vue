<template>
  <div class="day-event" :style="getEventBackgroundColor">
    <div v-if="!event.edit">
      <span class="has-text-centered details">{{ event.name }}</span> 
      <span class="has-text-centered details">{{ event.hour }}</span> 
      <div class="has-text-centered icons text-right">
        <i class="fa fa-pencil-square edit-icon text-danger"
          @click="editEvent(day.id, event.name)"> editar </i>
        <i class="fa fa-trash-o delete-icon text-primary"
          @click="deleteEvent(day.id, event.id)"> eliminar</i>
      </div>
    </div>
    <div v-if="event.edit">
      Evento : <input type="text" :placeholder="event.name" v-model="dataEvent.newEventName"/><br>
      Hora : <masked-input :placeholder="event.hour" mask="11:11" v-model="dataEvent.newEventHour"/>
      <div class="has-text-centered icons text-right text-primary">
        <i class="fa fa-check"
          @click="updateEvent(day.id, event, dataEvent)"> Editar</i>
      </div>
    </div>
  </div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
export default {
  name: 'CalendarEvent',
  props: ['event', 'day'],
  data () {
    return {
      dataEvent : {
        newEventName : '',
        newEventHour : ''
      }
    }
  },
  computed: {
    getEventBackgroundColor() {
      const colors = ['#FF9999', '#85D6FF', '#99FF99'];
      let randomColor = colors[Math.floor(Math.random() * colors.length)];
      return `background-color: ${randomColor}`;
    }
  },
  methods: {
    editEvent (dayId, name) {
      this.$store.dispatch('calendar/editEvent',{dayId, name});
    },
    updateEvent (dayId, eventOld, eventNew) {
      if (eventNew.newEventName === '') eventNew.newEventName = eventOld.name;
      if(eventNew.newEventHour === '') eventNew.newEventHour = eventOld.hour;
      this.$store.dispatch('calendar/updateEvent',{dayId, eventOld: eventOld, eventNew:eventNew}).then(
        ()=>{
        this.$swal("transaccion exitosa", `Se edito el evento ${eventNew.newEventName} a horas ${eventNew.newEventHour}`, "success");
        },error=>{
          console.log(error);
        }
      );
      this.newEventName = '';
    },
    deleteEvent (dayId, id) {
        this.$swal({
          title: 'Eliminar evento',
          text: 'Esta seguro de eliminar el evento',
          type: 'warning',
          buttons: {
          cancel: true,
          confirm: true,
          },  
        }).then((result) => {
          if(result) {
            this.$store.dispatch('calendar/deleteEvent',{dayId, id}).then(()=>{
              this.$swal('Eliminado', 'Se elimino el evento correctamente', 'success');
            });
          } else {
            this.$swal('Cancelado', 'No se elimino el evento', 'info')
          }
        })
    }
  },
  components:{MaskedInput}
}
</script>

<style lang="scss" scoped>
@import "~font-awesome/css/font-awesome.css";
.day-event {
  margin-top: 6px;
  margin-bottom: 6px;
  display: block;
  color: #4C4C4C;
  padding: 5px;

  .details {
    display: block;
  }

  .icons .fa {
    padding: 0 2px;
  }

  input {
    background: none;
    border: 0;
    border-bottom: 1px solid #FFF;
    width: 100%;

    &:focus {
      outline: none;
    }
  }
}
</style>
