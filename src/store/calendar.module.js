import CalendarService from '../services/calendar.service';
export const calendar = {
    namespaced: true,
    state: {
        status: true,
        data: null,
        dayActive: null,
        dataList: []
    },
    actions: {
        list({ commit }) {
            return CalendarService.list().then(
                response => {
                    commit('responseDataList', response.data);
                    return Promise.resolve(response.data);
                },
                error => {
                    commit('responseFailure');
                    return Promise.reject(error);
                }
            );
        }, //Metodos calendar
        getActiveDay({ state }) {
            let res = state.dataList.find((day) => day.active);
            return res;
        },
        setActiveDay({ state }, dayId) {
            state.dataList.map((dayObj) => {
                dayObj.id === dayId ? dayObj.active = true : dayObj.active = false;
            });
        },
        saveEvent({ state, commit }, event) {
            const activeDay = state.dataList.find((day) => day.active);
            event.dateEvent = activeDay;
            CalendarService.save(event).then(
                response => {
                    commit('responseSuccess');
                    response.edit = false;
                    let resp = response.data;
                    activeDay.events.push(resp);
                    return resp;
                },
                error => {
                    commit('responseFailure');
                    return Promise.reject(error);
                }
            );
        },
        resetEditOfAllEvents({ state }) {
            state.dataList.map((dayObj) => {
                dayObj.events.map((event) => {
                    event.edit = false;
                });
            });
        },
        editEvent({ dispatch }, obj) {
            dispatch('resetEditOfAllEvents');
            dispatch({ type: 'getEventObj', dayId: obj.dayId, eventDetails: obj.name }).then(resp => {
                resp.name += ' ';
                resp.edit = true;
            }, error => {
                console.log('error->', error);
            });
        },
        updateEvent({ commit, dispatch }, obj) {
            dispatch({ type: 'getEventObj', dayId: obj.dayId, eventDetails: obj.eventOld.name }).then(resp => {
                const eventObj = resp;
                eventObj.name = obj.eventNew.newEventName;
                eventObj.hour = obj.eventNew.newEventHour;
                eventObj.edit = false;
                CalendarService.update(eventObj).then(
                    response => {
                        commit('responseSuccess');
                        response.data;
                    },
                    error => {
                        commit('responseFailure');
                        console.log(error);
                    }
                );
            });
        },
        deleteEvent({ state }, obj) {
            CalendarService.delete(obj.id).then(
                () => {
                    const dayObj = state.dataList.find(
                        day => day.id === obj.dayId
                    );
                    const eventIndexToRemove = dayObj.events.findIndex(
                        event => event.id === obj.id
                    );
                    dayObj.events.splice(eventIndexToRemove, 1);
                },
                error => {
                    console.log(error);
                })

        },
        getEventObj({ state }, obj) {
            const dayObj = state.dataList.find(
                day => day.id === obj.dayId
            );
            return dayObj.events.find(
                event => event.name === obj.eventDetails
            );
        }

    },
    mutations: {
        responseSuccess(state, data) {
            state.status = true;
            state.data = data;
        },
        responseValid(state) {
            state.status = true;
        },
        responseFailure(state) {
            state.status = false;
            state.data = null;
        },
        responseData(state, data) {
            state.status = true;
            state.data = data
        },
        responseDataList(state, data) {
            state.status = true;
            state.dataList = data;
            state.dataList.forEach(item => {
                item.active = false;
                if (!item.events)
                    item.events = []
            });
            state.dataList = data;
        }
    },
    getters: {
        data(state) {
            state.data;
        }
    }
};