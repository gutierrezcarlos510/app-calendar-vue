<template>
  <div id="calendar-week" class="container">
    <!--<div class="row">
      <CalendarDay v-for="day in sharedState.seedData" class="col-md-2"
        :key="day.id"
        :day="day" />
    </div>-->
    <div class="row">
      <CalendarDay v-for="day in sharedState.dataList" class="col-md-2"
        :key="day.id"
        :day="day" />
    </div>
  </div>
</template>

<script>
//import { store } from '../store.js';
import CalendarDay from './CalendarDay.vue';
export default {
  name: 'CalendarWeek',
  data () {
    return {
      sharedState: this.$store.state.calendar,  
    }
  },
  created(){
    this.$store.dispatch('calendar/list');
  },
  components: {
    CalendarDay
  }
}
</script>

<style lang="scss" scoped>
#calendar-week {
  margin-bottom: 50px;
  .column {
    padding: 0 0 0 0;
  }
}
</style>
