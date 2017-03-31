//localStorage存储数据
let storage = {
	save(key,value){//储存数据
		localStorage.setItem(key,JSON.stringify(value))
	},
	fetch(key){//获取数据
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
//获取数据并赋值给list
let list = storage.fetch("miaovketang");
var vm = new Vue({
	el:".todoapp",
	data:{
		list:list,
		todo:"",
		editingId:"",  //存一下要编辑数据的id
		beforeTitle:"", //记录一下正在编辑的title
		hash: "all"
	},
	watch:{//监控数据变化
		list:{
			handler:function (){
				storage.save("miaovketang",this.list);	
			},
			deep:true
		}
	},
	computed:{//计算后的属性
		checkAll:{
			get(){
				return this.list.filter((item)=>item.isSelected).length === this.list.length;
			},
			set(value){

				this.list.forEach( item => {
					item.isSelected  = value;
				} )
			}
		},
		unSelectedLen:function (){
			return  this.list.filter( (item)=>!item.isSelected ).length	
		},
		selectedLen:function (){
			return this.list.length	- this.unSelectedLen;
		},
		filterList:function (){
			var list = [];
			if(this.hash === "all"){
				list = this.list;
			}else if(this.hash === "active"){
				list = this.list.filter( (item) => !item.isSelected )
			}else if(this.hash === "completed"){
				list = this.list.filter( (item) => item.isSelected )
			}else{
				list = this.list;
			}

			return list;	
		}
	},
	methods:{ 
		addTodo(){  //添加数据
			this.list.push({
				title:this.todo,
				id:Math.random(),
				isSelected:false
			})

			this.todo = '';

			
		},
		deleteTodo(id){	//删除指定id的数据
			this.list = this.list.filter( (item) => item.id !== id );
		},
		editDone(todo){ //编辑完成

			//失去焦点，判断一下当前编辑的数据是否为空
			if(todo.title.trim() === ""){
				//删除这条信息
				this.deleteTodo(todo.id);
			}

			this.editingId = "";
		},
		cancelEdit(todo){  //取消编辑

			todo.title = this.beforeTitle;
			this.beforeTitle = "";
			this.editingId = "";
		},
		editTodo(todo,index){

			//记录一下正编辑的信息的title
			this.beforeTitle = todo.title;

			this.editingId = todo.id;  //数据改变了
		//	this.$refs["editInput"+index][0].focus();
			this.$nextTick(function (){
				console.log("数据改变后，更新视图，DOM全部更新完成");
				this.$refs["editInput"+index][0].focus();

				/*var li = document.getElementsByClassName("editing")[0];
				var input = li.getElementsByTagName("input")[1];
				console.log( input );
				input.focus();
				//document.getElementsByClassName("editing")[0].focus();
				*/
			})

		},
		removeTodos(){
			//删除所有被选中的
			this.list = this.list.filter( (item) => !item.isSelected )
		}
	}
});

window.onhashchange = function (){
	let hash = 	window.location.hash.slice(2);
	vm.hash = hash;
}

window.onhashchange();