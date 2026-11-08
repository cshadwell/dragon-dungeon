export function setupRoomControls({notify,prefix,onAction=()=>{}}){
  const $=id=>document.getElementById(id);
  const controls=document.querySelector('.controls');
  // Reuse the maze console's exact buttons and fonts.
  const command=window.parent.document.querySelector('.command');
  const pad=command.querySelector('.control-area').cloneNode(true);
  const toolbar=command.querySelector('.toolbar').cloneNode(true);
  toolbar.querySelectorAll('#dragon-return,#earned-name').forEach(button=>button.remove());
  controls.append(pad,toolbar);
  $('space-action').onclick=onAction;
  const menu=$('room-menu');
  $('journal').onclick=()=>notify('journal');
  $('dungeon-music-toggle').onclick=()=>notify('sound');
  $('reset').onclick=()=>{
    $('room-menu-title').textContent='Begin again?';
    $('room-menu-text').textContent='This replaces your saved expedition and training progress.';
    $('room-menu-confirm').hidden=false;menu.showModal();
  };
  $('room-menu-confirm').onclick=()=>notify('reset');
  $('room-menu-close').onclick=()=>menu.close();
  $('room-menu-leave').onclick=()=>notify('leave');
  window.addEventListener('message',event=>{
    if(event.source!==window.parent||event.origin!==location.origin)return;
    if(event.data?.type===prefix+':journal'){
      $('room-menu-title').textContent='Journal';
      $('room-menu-text').textContent=event.data.text;
      $('room-menu-confirm').hidden=true;menu.showModal();
    }
    if(event.data?.type===prefix+':sound'){
      $('dungeon-music-toggle').textContent=event.data.muted?'Sound On':'Sound Off';
      $('dungeon-music-toggle').setAttribute('aria-pressed',String(!event.data.muted));
    }
  });
  notify('sound-status');
}
