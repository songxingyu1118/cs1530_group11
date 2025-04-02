package com.example.cs1530.service;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class OpenAIService {
    private final ChatClient chatClient;

    @Autowired
    public OpenAIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String complete(Message message) {
        return complete(List.of(message));
    }

    @Cacheable(value = "openaiCompletions", key = "#messages.toString()")
    public String complete(List<Message> messages) {
        return chatClient.prompt().messages(messages).call().content();
    }
}
