package umm3601.mongotest;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
public class MongoSpecTodo {

  private MongoCollection<Document> todoDocuments;

  static MongoClient mongoClient;
  static MongoDatabase db;

  @BeforeAll
  public static void setupDB() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void clearAndPopulateDB() {
    todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(
      new Document()
        .append("owner", "Josh")
        .append("status", true)
        .append("body", "Test Josh")
        .append("category", "video"));
    testTodos.add(
      new Document()
        .append("owner", "Jon")
        .append("status", true)
        .append("body", "Jon body")
        .append("category", "video"));
    testTodos.add(
      new Document()
        .append("owner", "Cena")
        .append("status", false)
        .append("body", "Cena Body")
        .append("category", "games"));

    todoDocuments.insertMany(testTodos);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> todos = new ArrayList<>();
    documents.into(todos);
    return todos;
  }

  private int countTodos(FindIterable<Document> documents) {
    List<Document> todos = intoList(documents);
    return todos.size();
  }

  @Test
  public void shouldBeThreeTodos() {
    FindIterable<Document> documents = todoDocuments.find();
    int numberOfTodos = countTodos(documents);
    assertEquals(3, numberOfTodos, "Should be 3 total todos");
  }

  @Test
  public void shouldBeOneJosh() {
    FindIterable<Document> documents = todoDocuments.find(eq("owner", "Josh"));
    int numberOfTodos = countTodos(documents);
    assertEquals(1, numberOfTodos, "Should be 1 todo from Josh");
  }

  @Test
  public void shouldBeTwoTrue() {
    FindIterable<Document> documents = todoDocuments.find(eq("status", true));
    int numberOfTodos = countTodos(documents);
    assertEquals(2, numberOfTodos, "Should be 2 todos that are true");
  }

  @Test
  public void shouldBeGamesAndFalse() {
    FindIterable<Document> documents
      = todoDocuments.find(and(eq("category", "games"),
      eq("status", false)));
    List<Document> docs = intoList(documents);
    assertEquals(1, docs.size(), "Should be 1");
    assertEquals("Cena", docs.get(0).get("owner"), "First should be Cena");
  }

  @Test
  public void justOwnerAndCategoryNoId() {
    FindIterable<Document> documents
      = todoDocuments.find()
      .projection(fields(include("owner", "category"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Josh", docs.get(0).get("owner"), "First should be Josh");
    assertNotNull(docs.get(0).get("category"), "First should have category");
    assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  }
}
