---
title: "最近写流程图和流程设计器的初始化demo"
description: "最近写流程图和流程设计器的初始化demo"
pubDate: "2025-03-13 23:27:24"
heroImage: "http://img.blog.loli.wang/2025-03-13-zjdemo/02.png"
tags:
  - 前端进阶
  - 操作
---

## 这个月不知道发生了什么。

这个月不知道发生了什么，多出来几个图表的功能，图表还是不是简单的展示图表，令人纠结，为了防止以后 无法回忆起当时做了什么，记录写个demo

## 1.流程图 Antv X6

```ts
import React, { useEffect, useRef, useState } from "react";
import { Graph, Shape } from "@antv/x6";
import dagre from "dagre";
import { fetch } from '@/api/order';
import "./workMap.scss";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 80;

const colorMap = {
    "SO No.": {
        textColor: "#FAD27B",
        bgColor: "#FAD27B",
    },
    "Schedule No.": {
        textColor: "#AAD09D",
        bgColor: "#AAD09D",
    },
    "Task No.": {
        textColor: "#89CCD5",
        bgColor: "#89CCD5",
    },
    "Operation No.": {
        textColor: "#8382BE",
        bgColor: "#8382BE",
    },
    "Purchase No.": {
        textColor: "#FA7B7B",
        bgColor: "#FA7B7B",
    },
    "Billing No.": {
        textColor: "#DC7DB0",
        bgColor: "#DC7DB0",
    }
} as any;

//  TO : Ocean TA: Air  TT :Trucking TC: Customs TW: Warehouse TE： Express TB: Billing
const taskTitleMatch = (type: string, label: string) => {
    if (type === "Task No.") {
        // 运输方式映射表
        const transportMap = {
            TO: 'Ocean',
            TA: 'Air',
            TT: 'Trucking',
            TC: 'Customs',
            TW: 'Warehouse',
            TE: 'Express',
            TB: 'Billing'
        } as any;
        // 提取label前2个字符作为运输方式代码
        const transportCode = label.slice(0, 2);
        // 返回匹配的运输方式全称，若无则返回原始label
        return `${transportMap[transportCode]} ${type}` ;
    } else {
        return type
    }
}


Shape.HTML.register({
    shape: "custom-html",
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    html(node) {
        const div = document.createElement("div");
        div.className = "custom-html";
        const { label, type } = node.data;
        // 根据 type 获取颜色配置，如果没有则使用默认颜色
        const { textColor, bgColor } = colorMap[type]

        div.innerHTML = `<div class="content" style=" background-color: ${bgColor}; border: 1px solid ${bgColor};">
        <div class="labelBox">
            <div>${taskTitleMatch(type, label)}</div>
        <div>
        <div class="textBox" style="color:#000">
            <div>${label}</div>
        <div>
    </div>`;
        return div;
    },
});

interface IProps {
    type: 'so' | 'po',
    orderNo: string
}
const OrgChartGraph: React.FC<IProps> = ({ type, orderNo }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);

    const { refetch, isLoading } = useQuery(
        ['fetch'],
        () =>
            fetch({
                orderNo
            }),
        {
            enabled: false,
            onSuccess(data: any) {
                if (data.code == 200) {
                    const source = data.data;
                    setData(source)
                    const { nodes, edges } = transformData(source);
                    setNodes(nodes)
                    setEdges(edges)
                } else {
                    message.error(data.message)
                }
            },
        },
    )

    function transformData(data: any[]) {
        const nodes = [] as any[];
        const edges = [] as any[];
        function traverse(node: { orderNo: any; type: any; createUser: any; child: any[]; }, parent: { orderNo: any; } | null) {
            // 将当前节点添加到 nodes 中
            nodes.push({
                id: node.orderNo,       // 使用 orderNo 作为节点 id
                label: node.orderNo,    // label 可按需求修改，比如显示 orderNo
                type: node.type,        // 用于后续 colorMap 的映射
                createUser: node.createUser,
            });

            // 如果存在父节点，则生成一条边，从父节点指向当前节点
            if (parent) {
                edges.push({
                    source: parent.orderNo,
                    target: node.orderNo,
                });
            }

            // 递归处理子节点
            if (node.child && node.child.length > 0) {
                node.child.forEach(child => traverse(child, node));
            }
        }

        // 处理根节点（注意接口返回的数据为数组）
        data.forEach(rootNode => traverse(rootNode, null));
        return { nodes, edges };
    }


    useEffect(() => {
        refetch()
    }, []);

    useEffect(() => {
        const graph = new Graph({
            container: containerRef.current!,
            interacting: {
                nodeMovable: false, // 禁止节点拖动
                edgeMovable: false, // 禁止连线拖动
            },
            panning: {
                enabled: true,
            },
            mousewheel: {
                enabled: true,
                modifiers: ['ctrl', 'meta'],
            },
        });
        
        nodes.forEach((node) => {
            graph.addNode({
                id: node.id,
                shape: "custom-html",
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                data: node,
            });
        });

        // 创建边
        edges.forEach((edge) => {
            graph.addEdge({
                source: edge.source,
                target: edge.target,
                attrs: {
                    line: {
                        strokeWidth: 2,
                        stroke: "#A2B1C3",
                        sourceMarker: null,
                        targetMarker: null,
                    },
                },
            });
        });

        // 自定义布局函数
        const layoutGraph = () => {
            const dir = "LR" as string;
            const g = new dagre.graphlib.Graph();
            g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 50 });
            g.setDefaultEdgeLabel(() => ({}));

            graph.getNodes().forEach((node) => {
                const { width, height } = node.getSize();
                g.setNode(node.id, { width, height });
            });

            graph.getEdges().forEach((edge) => {
                const sourceId = edge.getSourceCellId();
                const targetId = edge.getTargetCellId();
                g.setEdge(sourceId, targetId);
            });

            dagre.layout(g);

            g.nodes().forEach((id) => {
                const node = graph.getCellById(id) as any;
                if (node) {
                    const pos = g.node(id);
                    node.position(pos.x, pos.y);
                }
            });

            graph.getEdges().forEach((edge) => {
                const source = edge.getSourceNode();
                const target = edge.getTargetNode();
                if (!source || !target) return;

                const sourceBBox = source.getBBox();
                const targetBBox = target.getBBox();

                if ((dir === "LR" || dir === "RL") && sourceBBox.y !== targetBBox.y) {
                    const gap =
                        dir === "LR"
                            ? targetBBox.x - sourceBBox.x - sourceBBox.width
                            : -sourceBBox.x + targetBBox.x + targetBBox.width;
                    const fix = dir === "LR" ? sourceBBox.width : 0;
                    const x = sourceBBox.x + fix + gap / 2;
                    edge.setVertices([
                        { x, y: sourceBBox.center.y },
                        { x, y: targetBBox.center.y },
                    ]);
                } else if ((dir === "TB" || dir === "BT") && sourceBBox.x !== targetBBox.x) {
                    const gap =
                        dir === "TB"
                            ? targetBBox.y - sourceBBox.y - sourceBBox.height
                            : -sourceBBox.y + targetBBox.y + targetBBox.height;
                    const fix = dir === "TB" ? sourceBBox.height : 0;
                    const y = sourceBBox.y + fix + gap / 2;
                    edge.setVertices([
                        { x: sourceBBox.center.x, y },
                        { x: targetBBox.center.x, y },
                    ]);
                } else {
                    edge.setVertices([]);
                }
            });

            //   graph.centerContent();

        };

        layoutGraph();

    }, [data])

    return (
        <div>
            {/* 各颜色节点代表不同状态 */}
            <div className="flex flex-wrap gap-4 mb-4 ml-2">
                {Object.entries(colorMap).map(([key, { bgColor } ]:any) => (
                    <div key={key} className="flex items-center mr-4">
                        <span className="text-sm  mr-2 text-[#999999]">{key}</span> <div
                            className="w-6 h-3"
                            style={{ backgroundColor: bgColor }}></div>
                       
                    </div>
                ))}
            </div>
            <div className="html-basic-app">
                <div
                    className="app-content"
                    ref={containerRef}
                    style={{ width: "100%", height: "500px" }}
                />
            </div>
        </div>
    );
};

export default OrgChartGraph;


```

```scss


.html-basic-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;


  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
  }

  .custom-html {
    width: 100%;
    height: 100%;

    .content {
      border-radius: 5px;

      .labelBox {
        color: #FFF;
        font-weight: bold;
        font-size: 12px;
        text-indent: 1em;
        line-height: 30px;
      }

      .textBox {
        background-color: white;
        width: 100%;
        border-radius: 0 0 5px 5px;
        font-weight: 500;
        text-indent: 10px;
        font-size: 12px;
        line-height: 30px;
      }
    }
  }
}
```

演示效果

![0](http://img.blog.loli.wang/2025-03-13-zjdemo/01.png)


## 2. 拖拽流程图

```ts
# core.tsx
import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { EventEmitter } from 'events';


export let graph: Graph | null = null;

export const emitter = new EventEmitter;

export const initGraph = (container: HTMLElement) => {
    graph = new Graph({
        container,
        grid: true,
        mousewheel: {
            enabled: true,
            zoomAtMousePosition: true,
            modifiers: 'ctrl',
            minScale: 0.5,
            maxScale: 3,
        },
        connecting: {
            router: 'manhattan',
            connector: {
                name: 'rounded',
                args: { radius: 8 },
            },
            anchor: 'center',
            connectionPoint: 'anchor',
            allowBlank: false,
            snap: { radius: 20 },
            createEdge() {
                return new Shape.Edge({
                    attrs: {
                        line: {
                            stroke: '#A2B1C3',
                            strokeWidth: 2,
                            targetMarker: {
                                name: 'block',
                                width: 12,
                                height: 8,
                            },
                        },
                    },
                    zIndex: 0,
                })
            },
            validateConnection({ targetMagnet }) {
                return !!targetMagnet
            },
        },
        highlighting: {
            magnetAdsorbed: {
                name: 'stroke',
                args: {
                    attrs: {
                        fill: '#5F95FF',
                        stroke: '#5F95FF',
                    },
                },
            },
        },
    })

    // graph.on('node:click', () => {
    //     alert("第一个点击触发")
    // })

    // 使用插件
    graph
        .use(
            new Transform({
                resizing: true,
                rotating: true,
            }),
        )
        .use(
            new Selection({
                rubberband: true,
                showNodeSelectionBox: true,
            }),
        )
        .use(new Snapline())
        .use(new Keyboard())
        .use(new Clipboard())
        .use(new History())

    // 初始化 stencil
    const stencil = new Stencil({
        title: '流程图',
        target: graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 180,
        collapsable: true,
        groups: [
            { title: '基础流程图', name: 'group1' },
            {
                title: '系统设计图',
                name: 'group2',
                graphHeight: 250,
                layoutOptions: { rowHeight: 70 },
            },
        ],
        layoutOptions: {
            columns: 2,
            columnWidth: 80,
            rowHeight: 55,
        },
    })
    // 将 stencil 的容器挂载到对应 DOM 节点上
    document.getElementById('stencil')!.appendChild(stencil.container)

    onNodeClick();
    // 快捷键绑定及事件
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
        const cells = graph!.getSelectedCells()
        if (cells.length) graph!.copy(cells)
        return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
        const cells = graph!.getSelectedCells()
        if (cells.length) graph!.cut(cells)
        return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
        if (!graph!.isClipboardEmpty()) {
            const cells = graph!.paste({ offset: 32 })
            graph!.cleanSelection()
            graph!.select(cells)
        }
        return false
    })
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (graph!.canUndo()) graph!.undo()
        return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
        if (graph!.canRedo()) graph!.redo()
        return false
    })
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
        const nodes = graph!.getNodes()
        if (nodes) graph!.select(nodes)
    })
    graph.bindKey('backspace', () => {
        const cells = graph!.getSelectedCells()
        if (cells.length) graph!.removeCells(cells)
    })
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
        const zoom = graph!.zoom()
        if (zoom < 1.5) graph!.zoom(0.1)
    })
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
        const zoom = graph!.zoom()
        if (zoom > 0.5) graph!.zoom(-0.1)
    })

    // 鼠标移入移出时显示/隐藏连接桩
    const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
        for (let i = 0, len = ports.length; i < len; i += 1) {
            ports[i].style.visibility = show ? 'visible' : 'hidden'
        }
    }
    graph.on('node:mouseenter', () => {
        const container = document.getElementById('graph-container')!
        const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
        showPorts(ports, true)
    })
    graph.on('node:mouseleave', () => {
        const container = document.getElementById('graph-container')!
        const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
        showPorts(ports, false)
    })

    // 定义连接桩及端口
    const ports = {
        groups: {
            top: {
                position: 'top',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: { visibility: 'hidden' },
                    },
                },
            },
            right: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: { visibility: 'hidden' },
                    },
                },
            },
            bottom: {
                position: 'bottom',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: { visibility: 'hidden' },
                    },
                },
            },
            left: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: { visibility: 'hidden' },
                    },
                },
            },
        },
        items: [
            { group: 'top' },
            { group: 'right' },
            { group: 'bottom' },
            { group: 'left' },
        ],
    }

    // 注册自定义节点
    Graph.registerNode(
        'custom-rect',
        {
            inherit: 'rect',
            width: 66,
            height: 36,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 12,
                    fill: '#262626',
                },
            },
            ports: { ...ports },
        },
        true,
    )

    Graph.registerNode(
        'custom-polygon',
        {
            inherit: 'polygon',
            width: 66,
            height: 36,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 12,
                    fill: '#262626',
                },
            },
            ports: {
                ...ports,
                items: [{ group: 'top' }, { group: 'bottom' }],
            },
        },
        true,
    )

    Graph.registerNode(
        'custom-circle',
        {
            inherit: 'circle',
            width: 45,
            height: 45,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 12,
                    fill: '#262626',
                },
            },
            ports: { ...ports },
        },
        true,
    )

    Graph.registerNode(
        'custom-image',
        {
            inherit: 'rect',
            width: 52,
            height: 52,
            markup: [
                { tagName: 'rect', selector: 'body' },
                { tagName: 'image' },
                { tagName: 'text', selector: 'label' },
            ],
            attrs: {
                body: { stroke: '#5F95FF', fill: '#5F95FF' },
                image: {
                    width: 26,
                    height: 26,
                    refX: 13,
                    refY: 16,
                },
                label: {
                    refX: 3,
                    refY: 2,
                    textAnchor: 'left',
                    textVerticalAnchor: 'top',
                    fontSize: 12,
                    fill: '#fff',
                },
            },
            ports: { ...ports },
        },
        true,
    )

    // 创建 stencil 节点（基础流程图）
    const r1 = graph.createNode({
        shape: 'custom-rect',
        label: '开始',
        attrs: { body: { rx: 20, ry: 26 } },
    })
    const r2 = graph.createNode({
        shape: 'custom-rect',
        label: '过程',
    })
    const r3 = graph.createNode({
        shape: 'custom-rect',
        label: '可选过程',
        attrs: { body: { rx: 6, ry: 6 } },
    })
    const r4 = graph.createNode({
        shape: 'custom-polygon',
        label: '决策',
        attrs: { body: { refPoints: '0,10 10,0 20,10 10,20' } },
    })
    const r5 = graph.createNode({
        shape: 'custom-polygon',
        label: '数据',
        attrs: { body: { refPoints: '10,0 40,0 30,20 0,20' } },
    })
    const r6 = graph.createNode({
        shape: 'custom-circle',
        label: '连接',
    })
    stencil.load([r1, r2, r3, r4, r5, r6], 'group1')

    // 创建 stencil 图标节点（系统设计图）
    const imageShapes = [
        {
            label: 'Client',
            image: 'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg',
        },
        {
            label: 'Http',
            image: 'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg',
        },
        {
            label: 'Api',
            image: 'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg',
        },
        {
            label: 'Sql',
            image: 'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg',
        },
        {
            label: 'Clound',
            image: 'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg',
        },
        {
            label: 'Mq',
            image: 'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg',
        },
    ]
    const imageNodes = imageShapes.map((item) =>
        graph!.createNode({
            shape: 'custom-image',
            label: item.label,
            attrs: { image: { 'xlink:href': item.image } },
        }),
    )
    stencil.load(imageNodes, 'group2')

}


export const onNodeClick = () => {
    graph!.on('node:click', ({ node }) => {
        // 通知流程展开
        emitter.emit('flowDrawerShow',node);
        console.log(graph!.toJSON());
    })
}
```

```tsx
# index.tsx
import React, { createContext, useEffect } from 'react'
import FlowWithDrawer from '@/components/FlowWithDrawer'

import { initGraph } from '@/core/graph'

const FlowTools: React.FC = () => {
  useEffect(() => {
    initGraph(document.getElementById('graph-container')!)
  }, [])

  return (
      <div>
        <div id="container" className="flex h-screen">
          <div id="stencil" className="w-[200px] border-r border-gray-300 overflow-auto"></div>
          <div id="graph-container" className="flex-1 relative"></div>
        </div>
        <FlowWithDrawer/>
      </div>
  )
}

export default FlowTools

```
``` scss
# tailwind.css

@tailwind base;
@tailwind components;
@tailwind utilities;

#container {
    display: flex;
    border: 1px solid #dfe3e8;
}

#stencil {
    width: 180px;
    height: 100%;
    position: relative;
    border-right: 1px solid #dfe3e8;
}

#graph-container {
    width: calc(100% - 180px);
    height: 100%;
}

.x6-widget-stencil {
    background-color: #fff;
}

.x6-widget-stencil-title {
    background-color: #fff;
}

.x6-widget-stencil-group-title {
    background-color: #fff !important;
}

.x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0px;
    border: 1px solid #239edd;
}

.x6-widget-transform>div {
    border: 1px solid #239edd;
}

.x6-widget-transform>div:hover {
    background-color: #3dafe4;
}

.x6-widget-transform-active-handle {
    background-color: #3dafe4;
}

.x6-widget-transform-resize {
    border-radius: 0;
}

.x6-widget-selection-inner {
    border: 1px solid #239edd;
}

.x6-widget-selection-box {
    opacity: 0;
}
```

![0](http://img.blog.loli.wang/2025-03-13-zjdemo/02.png)
![0](http://img.blog.loli.wang/2025-03-13-zjdemo/03.png)

## 3. bpmn 图表

```tsx 
# core.ts
import BpmnJS from 'bpmn-js/lib/Modeler';
import test from '@/xml/test.bpmn'


export let modeler:BpmnJS;

export const initBpmn = (container: HTMLElement) => {
    if (modeler) return;
    // 创建 BpmnJS 实例
    modeler = new BpmnJS({
        container
    });

    modeler.importXML(test)
}

```

``` tsx
# index.tsx

import React, { useEffect, useRef } from "react";
import { initBpmn } from "@/core/core";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

const BpmnTools: React.FC = () => {

  useEffect(() => {
      initBpmn(document.getElementById("bpmnCanvas")!);
  }, []);

  return (
    <div className="app">
      <div
        id="bpmnCanvas"
        className="bpmn-viewer"
        style={{ width: "100%", height: "100vh" }}
      />
    </div>
  );
};

export default BpmnTools;

```
``` xml
# test.bpmn
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef">
  <process id="self_support_order_sales" name="self_support_order_sales" isExecutable="true">
    <documentation>self_support_order_sales</documentation>
    <startEvent id="startEvent1" name="开始"></startEvent>
    <userTask id="sid-2C6198F8-7872-416A-A5D7-520922753E6F" name="客户订单待接收" flowable:assignee="${task_user}" xmlns:buttonparam="http://buttonparam.com.cn" buttonparam:buttonparam="[{&quot;id&quot;:5,&quot;name&quot;:&quot;Reject&quot;,&quot;alias&quot;:&quot;Reject&quot;,&quot;cssname&quot;:&quot; &quot;,&quot;type&quot;:&quot;1&quot;,&quot;createTime&quot;:&quot;2021-03-16 12:04:38&quot;,&quot;updateTime&quot;:&quot;2021-08-24 09:44:57&quot;,&quot;$$hashKey&quot;:&quot;object:1312&quot;},{&quot;id&quot;:13,&quot;name&quot;:&quot;Confirm&quot;,&quot;alias&quot;:&quot;Confirm&quot;,&quot;cssname&quot;:&quot;primary&quot;,&quot;type&quot;:&quot;1&quot;,&quot;createTime&quot;:&quot;2021-03-17 16:39:09&quot;,&quot;updateTime&quot;:&quot;2021-08-24 09:45:45&quot;,&quot;$$hashKey&quot;:&quot;object:1315&quot;}]" xmlns:nodetype="http://nodetype.com.cn" nodetype:nodetype="" xmlns:mail_param="http://mailparam.com.cn" mail_param:mail_param="&quot;&quot;">
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[false]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <sequenceFlow id="sid-1EB675F0-8B1F-42E3-B105-AFD704C4F6B9" sourceRef="startEvent1" targetRef="sid-2C6198F8-7872-416A-A5D7-520922753E6F"></sequenceFlow>
    <userTask id="sid-43EB1A4D-AB9D-4E8E-954B-44B48738DE7C" name="客户订单已驳回" flowable:assignee="${task_user}" xmlns:buttonparam="http://buttonparam.com.cn" buttonparam:buttonparam="&quot;&quot;" xmlns:nodetype="http://nodetype.com.cn" nodetype:nodetype="" xmlns:mail_param="http://mailparam.com.cn" mail_param:mail_param="&quot;&quot;">
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[false]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <userTask id="sid-E0B61951-18D7-4CA5-B340-FE9A4CD4E9F0" name="销售订单待确认" flowable:assignee="${task_user}" xmlns:buttonparam="http://buttonparam.com.cn" buttonparam:buttonparam="[{&quot;id&quot;:5,&quot;name&quot;:&quot;Reject&quot;,&quot;alias&quot;:&quot;Reject&quot;,&quot;cssname&quot;:&quot; &quot;,&quot;type&quot;:&quot;1&quot;,&quot;createTime&quot;:&quot;2021-03-16 12:04:38&quot;,&quot;updateTime&quot;:&quot;2021-08-24 09:44:57&quot;,&quot;$$hashKey&quot;:&quot;object:2155&quot;},{&quot;id&quot;:13,&quot;name&quot;:&quot;Confirm&quot;,&quot;alias&quot;:&quot;Confirm&quot;,&quot;cssname&quot;:&quot;primary&quot;,&quot;type&quot;:&quot;1&quot;,&quot;createTime&quot;:&quot;2021-03-17 16:39:09&quot;,&quot;updateTime&quot;:&quot;2021-08-24 09:45:45&quot;,&quot;$$hashKey&quot;:&quot;object:2158&quot;}]" xmlns:nodetype="http://nodetype.com.cn" nodetype:nodetype="{
&quot;nodeType&quot;:&quot;Confirm_start&quot;,
&quot;signal&quot;:&quot;update_product&quot;
}" xmlns:mail_param="http://mailparam.com.cn" mail_param:mail_param="&quot;&quot;">
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[false]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <userTask id="sid-34D7D478-B1FE-42A8-BBB1-FDC6BA6BD169" name="销售订单已确认" flowable:assignee="${task_user}" xmlns:buttonparam="http://buttonparam.com.cn" buttonparam:buttonparam="&quot;&quot;" xmlns:nodetype="http://nodetype.com.cn" nodetype:nodetype="" xmlns:mail_param="http://mailparam.com.cn" mail_param:mail_param="&quot;&quot;">
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[false]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <endEvent id="sid-B45763A0-0E5F-41EF-B89F-54B52324D694"></endEvent>
    <sequenceFlow id="sid-39048C6C-4266-45C4-96C7-D1C030542352" sourceRef="sid-34D7D478-B1FE-42A8-BBB1-FDC6BA6BD169" targetRef="sid-B45763A0-0E5F-41EF-B89F-54B52324D694"></sequenceFlow>
    <userTask id="sid-DAF4B04E-6EF3-4AEB-B033-447CEA228874" name="销售订单已驳回" flowable:assignee="${task_user}" xmlns:buttonparam="http://buttonparam.com.cn" buttonparam:buttonparam="[{&quot;id&quot;:5,&quot;name&quot;:&quot;Reject&quot;,&quot;alias&quot;:&quot;Reject&quot;,&quot;cssname&quot;:&quot; &quot;,&quot;type&quot;:&quot;1&quot;,&quot;createTime&quot;:&quot;2021-03-16 12:04:38&quot;,&quot;updateTime&quot;:&quot;2021-08-24 09:44:57&quot;,&quot;$$hashKey&quot;:&quot;object:2988&quot;}]" xmlns:nodetype="http://nodetype.com.cn" nodetype:nodetype="" xmlns:mail_param="http://mailparam.com.cn" mail_param:mail_param="&quot;&quot;">
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[false]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <sequenceFlow id="sid-1EE913E4-CCAB-439D-BE26-338D4530DFC3" name="驳回(同步客户S/O)" sourceRef="sid-DAF4B04E-6EF3-4AEB-B033-447CEA228874" targetRef="sid-43EB1A4D-AB9D-4E8E-954B-44B48738DE7C">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${Reject}]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="sid-8CD85261-F4E8-438F-928C-6E891027584D" name="驳回" sourceRef="sid-E0B61951-18D7-4CA5-B340-FE9A4CD4E9F0" targetRef="sid-DAF4B04E-6EF3-4AEB-B033-447CEA228874">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${Reject}]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="sid-BDCCAE12-E4C3-482E-9065-9BF43459CC15" name="确认(触发orderP/O新建)" sourceRef="sid-E0B61951-18D7-4CA5-B340-FE9A4CD4E9F0" targetRef="sid-34D7D478-B1FE-42A8-BBB1-FDC6BA6BD169">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${Confirm}]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="sid-7040954B-1B18-450D-A42F-1EA77654A9CF" name="确认" sourceRef="sid-2C6198F8-7872-416A-A5D7-520922753E6F" targetRef="sid-E0B61951-18D7-4CA5-B340-FE9A4CD4E9F0">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${Confirm}]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="sid-262A809B-A151-4D1B-B8A7-3F23FCBFA358" name="驳回（同步客户P/O）" sourceRef="sid-2C6198F8-7872-416A-A5D7-520922753E6F" targetRef="sid-43EB1A4D-AB9D-4E8E-954B-44B48738DE7C">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${Reject}]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="sid-B904D61F-C5CF-41AB-A348-3B665ABC8A12" sourceRef="sid-43EB1A4D-AB9D-4E8E-954B-44B48738DE7C" targetRef="sid-B45763A0-0E5F-41EF-B89F-54B52324D694"></sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_self_support_order_sales">
    <bpmndi:BPMNPlane bpmnElement="self_support_order_sales" id="BPMNPlane_self_support_order_sales">
      <bpmndi:BPMNShape bpmnElement="startEvent1" id="BPMNShape_startEvent1">
        <omgdc:Bounds height="30.0" width="30.0" x="570.0" y="30.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-2C6198F8-7872-416A-A5D7-520922753E6F" id="BPMNShape_sid-2C6198F8-7872-416A-A5D7-520922753E6F">
        <omgdc:Bounds height="80.0" width="100.0" x="535.0" y="186.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-43EB1A4D-AB9D-4E8E-954B-44B48738DE7C" id="BPMNShape_sid-43EB1A4D-AB9D-4E8E-954B-44B48738DE7C">
        <omgdc:Bounds height="80.0" width="100.0" x="825.0" y="186.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-E0B61951-18D7-4CA5-B340-FE9A4CD4E9F0" id="BPMNShape_sid-E0B61951-18D7-4CA5-B340-FE9A4CD4E9F0">
        <omgdc:Bounds height="80.0" width="100.0" x="535.0" y="405.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-34D7D478-B1FE-42A8-BBB1-FDC6BA6BD169" id="BPMNShape_sid-34D7D478-B1FE-42A8-BBB1-FDC6BA6BD169">
        <omgdc:Bounds height="80.0" width="100.0" x="535.0" y="660.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-B45763A0-0E5F-41EF-B89F-54B52324D694" id="BPMNShape_sid-B45763A0-0E5F-41EF-B89F-54B52324D694">
        <omgdc:Bounds height="28.0" width="28.0" x="571.0" y="840.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-DAF4B04E-6EF3-4AEB-B033-447CEA228874" id="BPMNShape_sid-DAF4B04E-6EF3-4AEB-B033-447CEA228874">
        <omgdc:Bounds height="80.0" width="100.0" x="750.0" y="405.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="sid-BDCCAE12-E4C3-482E-9065-9BF43459CC15" id="BPMNEdge_sid-BDCCAE12-E4C3-482E-9065-9BF43459CC15">
        <omgdi:waypoint x="585.0" y="484.95000000000005"></omgdi:waypoint>
        <omgdi:waypoint x="585.0" y="660.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-8CD85261-F4E8-438F-928C-6E891027584D" id="BPMNEdge_sid-8CD85261-F4E8-438F-928C-6E891027584D">
        <omgdi:waypoint x="634.9499999999999" y="445.0"></omgdi:waypoint>
        <omgdi:waypoint x="750.0" y="445.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-1EE913E4-CCAB-439D-BE26-338D4530DFC3" id="BPMNEdge_sid-1EE913E4-CCAB-439D-BE26-338D4530DFC3">
        <omgdi:waypoint x="800.0" y="405.0"></omgdi:waypoint>
        <omgdi:waypoint x="800.0" y="247.0"></omgdi:waypoint>
        <omgdi:waypoint x="824.9999999999998" y="246.03653846153847"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-B904D61F-C5CF-41AB-A348-3B665ABC8A12" id="BPMNEdge_sid-B904D61F-C5CF-41AB-A348-3B665ABC8A12">
        <omgdi:waypoint x="875.0" y="265.95000000000005"></omgdi:waypoint>
        <omgdi:waypoint x="875.0" y="854.0"></omgdi:waypoint>
        <omgdi:waypoint x="598.9499200108609" y="854.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-262A809B-A151-4D1B-B8A7-3F23FCBFA358" id="BPMNEdge_sid-262A809B-A151-4D1B-B8A7-3F23FCBFA358">
        <omgdi:waypoint x="634.9499999999999" y="226.0"></omgdi:waypoint>
        <omgdi:waypoint x="824.9999999999804" y="226.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-1EB675F0-8B1F-42E3-B105-AFD704C4F6B9" id="BPMNEdge_sid-1EB675F0-8B1F-42E3-B105-AFD704C4F6B9">
        <omgdi:waypoint x="585.0" y="59.94999944212711"></omgdi:waypoint>
        <omgdi:waypoint x="585.0" y="186.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-7040954B-1B18-450D-A42F-1EA77654A9CF" id="BPMNEdge_sid-7040954B-1B18-450D-A42F-1EA77654A9CF">
        <omgdi:waypoint x="585.0" y="265.95000000000005"></omgdi:waypoint>
        <omgdi:waypoint x="585.0" y="405.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-39048C6C-4266-45C4-96C7-D1C030542352" id="BPMNEdge_sid-39048C6C-4266-45C4-96C7-D1C030542352">
        <omgdi:waypoint x="585.0" y="739.9499999999999"></omgdi:waypoint>
        <omgdi:waypoint x="585.0" y="840.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

记录下。。。。

![0](http://img.blog.loli.wang/2025-03-13-zjdemo/04.png)