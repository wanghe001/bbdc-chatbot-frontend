import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MessageBox from '@/components/MessageBox.vue';

describe('MessageBox.vue', () => {
  it('renders props.message when passed and sets the type from the type property', () => {
    const msg = 'new message';
    const type = 'bot';
    const wrapper = shallowMount(MessageBox, {
      propsData: { msg, type },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
