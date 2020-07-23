<template>
  <div id="calendar-entry">
    <div class="calendar-entry-note">
      <input type="text" placeholder="Nuevo evento" v-model="dataEvent.name" required />
      <p class="calendar-entry-day">
        Dia del evento: <span class="bold">{{getActiveDay()}} {{ dayActive? dayActive.fullTitle : '' }}</span>
      </p>
      <masked-input v-model="dataEvent.hour" placeholder="HH:mm" mask="11:11" />
      <p class="calendar-entry-day">
        Hora del evento
      </p>
      <a class="btn btn-success is-primary is-small is-outlined"
        @click="submitEvent(dataEvent)">
        Guardar
      </a>
    </div>
    <p style="color: red; font-size: 13px" v-if="error">
      {{msg}}
    </p>
  </div>
</template>

<script>
import Event from '../models/Event';
import MaskedInput from 'vue-masked-input'
export default {
  name: 'CalendarEntry',
  data () {
    return {
      dayActive : null,
      dataEvent: new Event('','','','',''),
      error: false,
      msg:''
    }
  },
  methods: {
    getActiveDay(){
      this.$store.dispatch('calendar/getActiveDay').then(resp=>{
        this.dayActive = resp;
      })
    },
    submitEvent (obj) {
      if (obj === null || this.dayActive==null){
        this.msg = 'Seleccion un dia para el evento'
        return this.error = true;
      } 
      if(obj && obj.name === ''){
        this.msg = 'Ingrese nombre del evento'
        return this.error = true;
      }
      if(obj && obj.hour === ''){
        this.msg = 'Ingrese hora del evento'
        return this.error = true;
      }
      let exist = false;
      if(this.dayActive.events && this.dayActive.events.length>0){
        this.dayActive.events.forEach(it=>{
          console.log(it.hour == obj.hour)
          if(it.hour == obj.hour){
            exist = true;
            this.msg = 'La hora del evento ya esta asignado por:'+it.name;
            return this.error = true;
          }  
        })
      }
      if(!exist)
      this.$store.dispatch('calendar/saveEvent',this.dataEvent).then(
        ()=>{
      this.$swal("transaccion exitosa", `Se guardo el evento ${this.dataEvent.name} a horas ${this.dataEvent.hour}`, "success");
      this.dataEvent.name='';
      this.dataEvent.hour='';
      this.error = false;
      
        },error=>{
          alert(error);
        }
      )
    }
  },
  components:{MaskedInput}
}
</script>

<style lang="scss" scoped>
#calendar-entry {
  background: #FFF;
  border: 1px solid #42b883;
  border-radius: 10px;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;

  .calendar-entry-note {
    input {
      width: 200px;
      font-weight: 600;
      border: 0;
      border-bottom: 1px solid #CCC;
      font-size: 15px;
      height: 30px;
      margin-bottom: 10px;

      &:focus {
        outline: none;
      }
    }

    .calendar-entry-day {
      color: #42b883;
      font-size: 12px;
      margin-bottom: 10px;
      padding-bottom: 5px;

      .bold {
        font-weight: 600;
      }
    }

    .submit {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
