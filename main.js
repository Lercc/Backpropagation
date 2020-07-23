var app = new Vue({
    el: '#app',

    data: {
        message: 'Hello Vue!',
        mostrarTablaPatrones: false,
        // btnSiguietePatron: false,
        //
        numNeurEntrada: null,
        numNeurEscondidas: null,
        numNeurSalida: null,
        numPatronesEntrenamiento: null,
        numPesosTotales: null,
        numIteraciones: null,
        //
        w: new Array(),
        x: new Array(),
        d: new Array(),
        //
        // X: new Array(), //array de patron de entrada por iteracion
        // D:  new Array(), //array de patron de salida deseada por iteracion
        //
        Y2: new Array(),    // array para las salidas de las neuronas ocultas
        Y3: new Array(),    // array para las salidas de las neuronas de salida
        //
        net2: new Array(),   // array para las entradas netas de las neuronas ocultas
        net3: new Array(),   // array para las entradas netas de las neuronas de salida
        //
        delta2: new Array(), // array para los errores de las neuronas ocultas
        delta3: new Array(), // array para los errores de las neuronas de salida
        //
        alfa: 0.2              //valor de alfa



    },

    computed: {
        calcularPesos: function() {
            this.numPesosTotales = this.numNeurEscondidas * (this.numNeurEntrada + this.numNeurSalida)
            this.w = []

            //PASO 1 : signar los pesos de la red con valores pequeños aleaotrios.
            const min = -1/3
            const max = 1/3

            for (var i=0; i<this.numPesosTotales; i++) {
                this.w[i] = Math.random() * (max - min) + min
            }
        },
        isAccedOne : function () {
            if (this.numNeurEntrada && this.numNeurEscondidas && this.numNeurSalida &&this.numPatronesEntrenamiento) {
                return false
            }else {
                return true
            }
        },
        isReadyToLearn: function() {
            if (this.numIteraciones) {
                return false
            }else {
                return true
            }
        }
    },

    methods: {
        inicializarPatrones: function() {
            this.x = []
            this.d = []

            for(let i=0; i<this.numPatronesEntrenamiento; i++) {
            
                this.x[i] = new Array()
                for(let j=0; j<this.numNeurEntrada; j++) {
                    this.x[i][j] = j
                }

                this.d[i] = new Array()
                for(let k=0; k<this.numNeurSalida; k++) {
                    this.d[i][k] = k
                }
            }
            this.mostrarTablaPatrones=true
        },
        entrenarNeurona : function() {

            // for para entrenamiento de "i" iteraciones
            for(let i=0; i<this.numIteraciones; i++){
                
                /**
                 * 
                 * Paso 2 : Presentar patron de entrada y salida deseada
                 * 
                 */
                
                // define el patrone "n-esimo" : (entrada-n-esima + salida-n-esima) 
                for(let n=0; n<this.numPatronesEntrenamiento; n++) {
                    
                    let X = Array()     //array de patron de entrada por iteracion
                    let D = Array()     //array de patron de salida deseada por iteracion
                  
                    //define los "valores de entrada" del patron n-esimo
                    for(let i=0; i<this.numNeurEntrada; i++){
                        X[i] = this.x[n][i]
                    }
                    
                    //define los valores de salidad deseada del patron n-esimo
                    for(let i=0; i<this.numNeurSalida; i++){
                        D[i] = this.d[n][i]
                    }
                    
                    //De modo que quedaria  en cada iteracion:
                    /**  primera iteracion  X[0]=1   X[1]=1 */  /**  D[0]=1 */
                    /**  segunda iteracion  X[0]=0   X[1]=1 */  /**  D[0]=0 */
                    /**  tercera iteracion  X[0]=1   X[1]=0 */  /**  D[0]=0 */
                    /**  cuarta iteracion   X[0]=0   X[1]=0 */  /**  D[0]=0 */
                    

                    /**
                     * 
                     * Paso 3 : CALCULAR LAS ENTRADAS NETAS Y SALIDAS DE LAS NEURONAS
                     * 
                     */

                    //(3.i): CALCULAR LAS ENTRADAS NETAS DE LAS NEURONAS OCULTAS(N.O.)
                        //La cantidad de entradas netas es la misma cantidad de N.O.
                    for(let i=0; i<this.numNeurEscondidas; i++) {
                        
                        var indicePeso = i
                        this.net2[i]=0

                        for(let j=0; j<this.numNeurEntrada; j++) {
                            this.net2[i] += this.w[indicePeso] * X[j]
                            indicePeso += this.numNeurEscondidas
                        }
                    }
                    //console.log(this.net2)
                        /**
                            * recordando que los valores netos son calculados
                            * a partir de la sumatoria de los pesos(w) por su respectiva entrada(X)
                            * net(H) = Σ(w * x) 
                            * 
                            * ejemplo  de 3 entradas y 2 ocultas
                            * 
                            *  net2[1] =  w[1] * x[1]
                            *              |    |
                            *      +indicePeso  +j
                            *              |    |
                            *  net2[1] += w[3] * x[2]
                            *              |    |
                            *      +indicePeso  +j
                            *              |    |
                            *  net2[1] += w[5]} * x[3]
                            * 
                            * ///////////////////////////
                            * 
                            * net2[2] =  w[2] * x[1]
                            *              |    |
                            *      +indicePeso  +j
                            *              |    |
                            *  net2[2] += w[4] * x[2]
                            *              |    |
                            *      +indicePeso  +j
                            *              |    |
                            *  net2[2] += w[6]} * x[3]
                            * 
                         */

                    //(3.ii): CALCULAR LAS SALIDAS(Y2) DE LAS NEURONAS OCULTAS(N.O.)
                        //La cantidad de salidas es la misma cantidad de N.O.
                        // y=1/1+e-x
                        //
                    for(let i=0; i<this.numNeurEscondidas; i++) {
                        this.Y2[i] = 1 / (1 + Math.exp(-(this.net2[i])))
                    }

                    //(3.iii): CALCULAR LAS ENTRADAS NETAS Y SALIDAS DE LAS NEURONAS 
                    //            DE LA CAPA DE SALIDA
                    for(let i=0; i<this.numNeurSalida; i++) {
                        
                        var indicePesoOculto = i+ (this.numNeurEntrada*this.numNeurEscondidas)
                        this.net3[i]=0

                        for(let j=0; j<this.numNeurEscondidas; j++) {
                            this.net3[i] += this.w[indicePesoOculto] * this.Y2[j]
                            indicePesoOculto += this.numNeurSalida
                        }
                    }
                    for(let i=0; i<this.numNeurSalida; i++) {
                        this.Y3[i] = 1 / (1 + Math.exp(-(this.net3[i])))
                    }

                    /**
                     * 
                     * Paso 4 : CALCULAR LOS TÉRMINOS DE ERROR PARA  TODAS LAS NEURONAS
                     * 
                     */
                    
                    //(4.i): términos de error para las neuronas de salida 
                    for(let i=0; i<this.numNeurSalida; i++) {
                        this.delta3[i] = (D[i] - this.Y3[i]) * this.Y3[i] * (1 - this.Y3[i])
                    }

                    //(4.ii): términos de error para las neuronas ocultas
                    //delta2[n]: Y2n* (1-Y2n)*(d31*w1 + d32*w2 +.... + d3n*wn)
                    
                    var indicePesoOcultoDos = 0 + (this.numNeurEntrada*this.numNeurEscondidas)
                    for(let i=0; i<this.numNeurEscondidas; i++) {
                        
                        var sumatoriaDeltaXpeso = 0

                        for(let j=0; j<this.numNeurSalida; j++) {
                            sumatoriaDeltaXpeso += this.delta3[j] * this.w[indicePesoOcultoDos]
                            indicePesoOcultoDos++
                        }

                        this.delta2[i] = this.Y2[i] * (1 - this.Y2[i]) * (sumatoriaDeltaXpeso)
                    }
                    
                }

            }
        }
    }
    
});