export function getClickupChecklist() {
  const rows = [];
  const prefix = '- [ ] - ';
  const checkList = document.querySelectorAll('cu-checklist');

  for (let i = 0; i < checkList.length; i++) {
    const checkListItems = checkList[i].querySelectorAll('cu-checklist-item');
    for (let j = 0; j < checkListItems.length; j++) {
      const checkListItem = checkListItems[j];
      const dropList = checkListItem.querySelector('.cdk-drop-list');
      const hasChildren = dropList.children.length > 0;

      const children = [];
      const name = checkListItem.querySelector(
        '.cu-checklist-item__name'
      ).innerHTML;

      if (hasChildren) {
        const dropListChildren = dropList.querySelectorAll(
          '.cu-checklist-item__name'
        );
        for (let k = 0; k < dropListChildren.length; k++) {
          children.push(dropListChildren[k].innerHTML);
        }
      }

      rows.push({ name, children });
    }
  }

  const result = rows
    .reduce((markdown, { name, children }) => {
      const childMarkdown = children.map((childName) =>
        '  '.concat(prefix, childName)
      );

      return markdown.concat(prefix.concat(name), childMarkdown);
    }, [])
    .join('\n');

  return result;
}
