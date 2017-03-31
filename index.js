
var storage = {
	save(key,value){//储存数据
		localStorage.setItem(key,JSON.stringify(value))
	},
	fetch(key){//获取数据
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var list=storage.fetch('liuhanhan')
var vm=new Vue({
	el:'.todoapp',
	data:{
		list:list,
		todo:'',
		hash:'all'
	},
	watch:{//监控数据变化
		list:{
			handler:function (){
				storage.save("liuhanhan",this.list);	
			},
			deep:true
		}
	},
	computed:{
		checkAll:{
			set(value){
				this.list.forEach(function(item){
					item.ischecked=value;
				})
			},
			get(){
				return this.list.filter(function(item){
					return item.ischecked
				}).length===this.list.length;
			}
		},
		unSelectedLen:function(){
			return this.list.filter(function(item){ 
				return item.ischecked==false
			}).length
		},
		filterList:function(){
			var list=[];
			if(this.hash=='all'){
				list=this.list
			}else if(this.hash=='active'){
				list=this.list.filter(function(item){
					return item.ischecked===false
				})
			}else if(this.hash=='completed'){
				list=this.list.filter(function(item){
					return item.ischecked!==false
				})
			}else{
				list=this.list
			}
			return list
		}
	},
	methods:{
		
		addTodo(){
			this.list.push({
				title:this.todo,
				id:Math.random(),
				ischecked:false,
				editing:''
			})
			this.todo=''
		},
		delateTodo(id){
			console.log(id)
			this.list=this.list.filter(function(item){
				return item.id!==id
			})
//			this.list = this.list.filter( (item) => item.id !== id );
		},
		clearComplate(){
			this.list=this.list.filter(function(item){
				return !item.ischecked
			})
		}
	}
})

window.onhashchange=function(){
	var hash=window.location.hash.slice(2);
	vm.hash=hash
}
window.onhashchange();