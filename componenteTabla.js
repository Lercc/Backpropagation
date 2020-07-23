Vue.component('tablaPatrones',{
    props: [
        'numNeurEntrada',
        'numNeurSalida',
        'numPatronesEntrenamiento',
        'x',
        'd',
    ],

    data() {
        return {
            counter:0
        }
    },

    methods: {
    },

    template: `
    <div>
        <table border="1px">
            <tr>
                <th :colspan="numNeurEntrada">Entradas</th>   
                <th :colspan="numNeurSalida">Salidas</th>
            </tr>
            <tr v-for="(patron, index) in numPatronesEntrenamiento">
                <td v-for="(entrada,indiceEntrada) in x[index]"><input v-model.number="x[index][indiceEntrada]" type="number" min="0"></td> 
                <td v-for="(salida,indiceSalida) in d[index]"><input v-model.number="d[index][indiceSalida]" min="0"></td> 
            </tr> 
        </table>
    </div>
    ` 
});
