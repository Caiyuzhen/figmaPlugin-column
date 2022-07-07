
// 如果是 figma 插件类型的话，开始执行以下的方法 ————————————————————————————————————————————————————————————————————
if (figma.editorType === 'figma') {

  // iframe 内渲染 UI ————————————————————————————————————————————————————————————————————
  figma.showUI(__html__);

	//创建一个空【列】
	function createColumn() {
		const cellPadding = 0
		const grid = figma.createFrame() //创建个空的 frame
		grid.layoutMode = "HORIZONTAL" //水平排列
		grid.counterAxisSizingMode = "AUTO" //自动布局
		grid.name = "ROW"
		grid.clipsContent = false
		grid.itemSpacing = cellPadding //0
		grid.backgrounds = []
		return grid
	}


	//创建一个空【行】 
	function createRow() {
	const cellPadding = 0
	const frame = figma.createFrame() //创建个空的 frame
	frame.layoutMode = "HORIZONTAL" //水平排列
	frame.counterAxisSizingMode = "AUTO" //自动布局
	frame.name = "ROW"
	frame.clipsContent = false
	frame.itemSpacing = cellPadding //0
	frame.backgrounds = []
	return frame
	}
	console.log("Done")


	//创建网格的方法
	function createGrid(rowCount, rowSpace, colCount, colSpace){ //传入四个参数
		console.log("创建网格中...")

		//获取当前选中的元素
		const selectionEle = figma.currentPage.selection

		//如果没有选中元素, 则提示需要选中元素才能进行操作
		if(!selectionEle){
			figma.notify("请选中元素后再操作")
			return
		}

		//获得元素的父节点以及当前的位置
		const { x, y, parent } = selectionEle[0]

		//创建最外层的容器【列】, 并且设置容器的【位置】以及【行间距】
		const list = createColumn()
			list.x = x 	//移动到当前的 x 坐标
			list.y = y	//移动到当前的 y 坐标
			list.itemSpacing = rowSpace  //让行间距 = 传入的参数

		//把最外层的容器【列】,挂载到当前的【父节点】上
		parent.appendChild(list)

		//用选中的节点进行不断的复制，直到创建成为一个 table 的方法
		if(selectionEle.length > 1){
			selectionEle.forEach(node => {
				list.appendChild(node) //把遍历出来节点添加到容器中
			})
		} else {
			//创建一个【行】容器
			const rowList = createRow() 

			//将选中的节点添加到第一【行】容器中
			const cell = selectionEle[0] as FrameNode
			rowList.appendChild(cell)

			//不断的复制，并且添加到【第一行】容器中，直到达到【用户输入的数字】为止
			for(let i = 1; i < colCount; i++){
				let colClone = cell.clone() //克隆当前的节点,然后再放入【第一行】
				rowList.appendChild(colClone)
			}
			rowList.itemSpacing = colSpace
			list.appendChild(rowList)

			//不断的复制第一行，直到达到【用户输入的数字】为止
			for(let i =	1; i < rowCount; i++){
				let rowClone = rowList.clone() //克隆当前的【第一行】
				list.appendChild(rowClone)
			}
		}
		//选中上面新建的这个 list 对象, 并且将视图定位到这个对象的位置
		figma.currentPage.selection = [list]
		figma.viewport.scrollAndZoomIntoView([list])
		return
	}

	//调用 UI 层的通讯接口
	figma.ui.onmessage = msg => {
		/// 响应 create grid 事件
		if (msg.type === 'auto-create-column') {
		   const { rowCount, rowSpace, colCount, colSpace } = msg.config //从 msg 内解构赋值获得这几个参数
		   //调用创建 Grid 的方法并传参
		   createGrid(rowCount, rowSpace, colCount, colSpace)
		}  
	}
}
