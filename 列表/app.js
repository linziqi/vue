/**
 * Created by linziqi on 2017/10/2.
 */
var store={
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return  JSON.parse(localStorage.getItem(key))||[]
    },
};
var filterList={
    all(data){
        return data;
    },
    finshed(data){
        return finshedFn(data,true);
    },
    unfinshed(data){
        return finshedFn(data,false);
    }
};
function finshedFn(data,bv) {
    if(typeof data=='string'){
        return data;
    }else{
        return data.filter(function(item){
            return bv?item.isChecked:!item.isChecked;
        })
    };
};
var list=store.get('todo');
var vm=new Vue({
    el:'.main',
    data:{
        list:list,
        todo:'',
        edtorTodos:'',
        todoTitle:'',
        typeChange:'all'
    },
    watch:{  //监控数据变化
        list:{
           handler(){
               store.save('todo',this.list)
           },
           deep:true   //深处数据变化开关
        },
    },
    computed:{   //逻辑属性抽离
        noCheckedLength(){
            return this.list.filter(function(item){
                return !item.isChecked;
            }).length
        },
        listItem(){
            return filterList[this.typeChange](this.list);
        }
    },
    methods:{   //方法属性
        addTodo(data,ev){
            this.list.push({
                title:this.todo,
                isChecked:false
            });
            this.todo='';
        },
        removeTodo(data){
            var index=this.list.indexOf(data);
            this.list.splice(index,1);
        },
        edtorTodo(data){
            this.todoTitle=data.title;
            this.edtorTodos=data;
        },
        edtorEnd(){
            this.edtorTodos='';
        },
        edtorEsc(data){
            data.title=this.todoTitle;
            this.todoTitle='';
            this.edtorTodos='';
        },

    },
    directives:{  //自定义属性
        'focus':{
            update(el,binding){
                if(binding.value==true){
                    el.focus();
                }
            }
        },
    }
});
function watchHashchange() {
    var hash=window.location.hash.slice(1);
    vm.typeChange=filterList[hash]?filterList[hash](hash):'all';
};
watchHashchange();
window.addEventListener('hashchange',watchHashchange);