import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./MyEditor.css";

import createToolbarPlugin from '@draft-js-plugins/static-toolbar';


export default function MyEditor({ editorState, setEditorState, toolBar }) {
    // Убедимся, что toolBar - это boolean
    const isToolBarEnabled = typeof toolBar === 'boolean' && toolBar;
    const toolbarPlugin = createToolbarPlugin();

    const toolbarProps = isToolBarEnabled ? {
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: false },
        history: { inDropdown: true },
        image: {
            uploadCallback: uploadImageCallback,
            alt: { present: true, mandatory: false },
            previewImage: true,
        },
    } : {};


    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                plugins={[toolbarPlugin]}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                toolbarClassName="demo-toolbar"
                // toolbar={{
                //     inline: { options: [] }, // Убираем все опции для жирности и других форматирований
                //     list: { options: [] }, // Убираем списки
                //     textAlign: { options: [] }, // Убираем выравнивание текста
                //     link: { options: [] }, // Убираем ссылки
                //     history: { options: [] }, // Убираем историю
                //     colorPicker: { options: [] }, // Убираем выбор цвета
                //     image: { options: [] }, // Убираем иконку загрузки изображений
                // }}
            />
        </div>
    );
}

const uploadImageCallback = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ data: { link: reader.result } });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
