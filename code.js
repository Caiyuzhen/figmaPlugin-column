// figma 插件类型
if (figma.editorType === 'figma') {
    // iframe 内渲染 UI
    figma.showUI(__html__);
    // 监听发生的消息​
    // 从 HTML 页面中调用 "parent.postMessage "将触发这个回调。该回调信息将被传递给 "pluginMessage "的属性来发布信息
    figma.ui.onmessage = msg => {
        // 接收对应消息，进行处理: 区分从 HTML 产生的消息类型, 比如是 create-shapes 类型
        if (msg.type === 'create-shapes') {
            console.log('创建分栏中。。。');
            // 定义一个节点数组，进行创建
            const nodes = [];
            //msg.count 为用户输入的数字，根据这个数字生成对应的矩形
            for (let i = 0; i < msg.count; i++) {
                // 通过 figma 的 createRectangle api 来创建一个矩形节点
                const rect = figma.createRectangle();
                // 修改其位置
                rect.x = i * 150;
                // 修改其填充色​
                rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
                // 将创建后的矩形矩形添加到当前页面中
                figma.currentPage.appendChild(rect);
                // 添加到节点数组中​
                nodes.push(rect);
            }
            // 选中全部新建的节点，并将 figma 窗口移动到对应位置, 让用户能够看到所有节点
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
        }
        //关闭该插件。否则，该插件将会继续运行，显示屏幕底部的取消按钮。
        figma.closePlugin();
    };
    // 如果插件没有持续运行则会执行此代码
}
else {
    figma.showUI(__html__);
    figma.ui.onmessage = msg => {
        if (msg.type === 'create-shapes') {
            const numberOfShapes = msg.count;
            const nodes = [];
            for (let i = 0; i < numberOfShapes; i++) {
                const shape = figma.createShapeWithText();
                // 你可以将 shapeType 设置为以下之一。正方形' | '椭圆' | '圆角矩形' | '钻石' | '三角形_上' | '三角形_下' | '平行四边形_右' | '平行四边形_左' 
                shape.shapeType = 'ROUNDED_RECTANGLE';
                shape.x = i * (shape.width + 200);
                shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
                figma.currentPage.appendChild(shape);
                nodes.push(shape);
            }
            ;
            for (let i = 0; i < (numberOfShapes - 1); i++) {
                const connector = figma.createConnector();
                connector.strokeWeight = 8;
                connector.connectorStart = {
                    endpointNodeId: nodes[i].id,
                    magnet: 'AUTO',
                };
                connector.connectorEnd = {
                    endpointNodeId: nodes[i + 1].id,
                    magnet: 'AUTO',
                };
            }
            ;
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
            figma.ui.postMessage('啦啦啦'); //给 html Ui 层传递数据
        }
        //确保在你完成后关闭该插件。否则，该插件将继续运行，显示屏幕底部的取消按钮。
        figma.closePlugin();
    };
}
;
